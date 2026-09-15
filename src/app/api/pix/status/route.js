import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

if (!globalThis._pixCache) globalThis._pixCache = new Map();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });

  // 1) Ve cache do webhook (mais confiavel)
  const cached = globalThis._pixCache.get(id);
  if (cached?.paid) {
    return NextResponse.json({
      id,
      status: 'paid',
      paid: true,
      source: 'webhook_cache',
      updated_at: cached.updated_at,
    });
  }

  // 2) Fallback: consulta Imperium direto
  try {
    const publicKey = process.env.IMPERIUM_PUBLIC_KEY;
    const privateKey = process.env.IMPERIUM_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return NextResponse.json({ id, status: 'pending', paid: false, source: 'no_creds' });
    }

    const resp = await fetch(`https://api.imperiumpay.com/v1/sales/${id}`, {
      method: 'GET',
      headers: {
        'X-Api-Public-Key': publicKey,
        'X-Api-Private-Key': privateKey,
      },
    });

    if (!resp.ok) {
      return NextResponse.json({ id, status: 'pending', paid: false, source: 'imperium_error' });
    }

    const data = await resp.json();
    const sale = data.sale || data;
    const rawStatus = String(sale.status || sale.paymentStatus || 'pending').toLowerCase();
    const isPaid = ['paid', 'approved', 'completed', 'success'].some(s => rawStatus.includes(s));

    if (isPaid) {
      globalThis._pixCache.set(id, {
        status: 'paid',
        paid: true,
        raw: sale,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      id,
      status: isPaid ? 'paid' : rawStatus,
      paid: isPaid,
      source: 'imperium_api',
    });
  } catch (e) {
    return NextResponse.json({ id, status: 'pending', paid: false, source: 'exception', error: e.message });
  }
}
