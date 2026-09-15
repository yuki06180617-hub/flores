import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cache em memoria dos pagamentos (basico — em prod usar DB)
// Como esta em serverless, cada instancia tem seu proprio Map
// Serve so pra desenvolvimento
if (!globalThis._pixCache) globalThis._pixCache = new Map();

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log('[Imperium Webhook] recebido:', JSON.stringify(body).slice(0, 500));

    const sale = body?.sale || body || {};
    const paymentId = String(sale.id || body.id || '');
    const status = sale.status || sale.paymentStatus || body.status || 'unknown';

    if (paymentId) {
      const normalized = String(status).toLowerCase();
      const isPaid = ['paid', 'approved', 'completed', 'success'].some(s => normalized.includes(s));
      globalThis._pixCache.set(paymentId, {
        status: isPaid ? 'paid' : normalized,
        paid: isPaid,
        raw: body,
        updated_at: new Date().toISOString(),
      });
      console.log(`[Imperium Webhook] ${paymentId} -> ${isPaid ? 'paid' : normalized}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.error('[Imperium Webhook] erro:', e);
    return NextResponse.json({ received: true, error: e.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'Imperium webhook endpoint',
    cached: globalThis._pixCache?.size || 0,
  });
}
