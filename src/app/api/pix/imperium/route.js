import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req) {
  const headers = corsHeaders();
  try {
    const body = await req.json();
    const { nome, cpf, email, telefone, valor, items } = body || {};

    if (!nome || !cpf || !valor) {
      return NextResponse.json({ error: 'Dados obrigatorios: nome, cpf, valor' }, { status: 400, headers });
    }

    const publicKey = process.env.IMPERIUM_PUBLIC_KEY;
    const privateKey = process.env.IMPERIUM_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return NextResponse.json({ error: 'Credenciais Imperium nao configuradas' }, { status: 500, headers });
    }

    const docNumber = String(cpf).replace(/\D/g, '');
    const phone = String(telefone || '').replace(/\D/g, '') || '11999999999';
    const emailFallback = email || `${docNumber}@example.com`;
    const valorCentavos = parseInt(valor, 10);

    // Constroi items pro Imperium
    const impItems = Array.isArray(items) && items.length > 0
      ? items.map((i) => ({
          title: i.nome || i.title || 'Produto',
          quantity: i.qtd || i.quantity || 1,
          unitPrice: parseInt(i.preco * 100, 10) || parseInt(i.unitPrice, 10) || valorCentavos,
        }))
      : [{ title: 'Pedido Rosa Maria', quantity: 1, unitPrice: valorCentavos }];

    const impResp = await fetch('https://api.imperiumpay.com/v1/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Public-Key': publicKey,
        'X-Api-Private-Key': privateKey,
      },
      body: JSON.stringify({
        amount: valorCentavos,
        paymentMethod: 'PIX',
        customer: {
          name: nome,
          document: docNumber,
          email: emailFallback,
          phone: phone,
        },
        items: impItems,
      }),
    });

    const data = await impResp.json();

    if (!impResp.ok) {
      console.error('[pix imperium] erro:', impResp.status, JSON.stringify(data));
      return NextResponse.json({ error: data.message || 'Erro ao criar pagamento', detalhes: data }, { status: impResp.status, headers });
    }

    const sale = data.sale || data;
    const pixInfo = sale.payment?.pix || sale.pix || {};
    const qrCode = pixInfo.qrCodeBase64 || pixInfo.qrcode || pixInfo.qrCode;
    const copiaCola = pixInfo.key || pixInfo.code || pixInfo.copyPaste;
    const transactionId = String(sale.id || data.id || '');

    if (!transactionId) {
      return NextResponse.json({ error: 'Resposta inesperada da Imperium' }, { status: 500, headers });
    }

    return NextResponse.json({
      sucesso: true,
      transaction_id: transactionId,
      pixCode: copiaCola,
      pixQrCodeImage: qrCode,
      valor: valorCentavos,
    }, { headers });
  } catch (e) {
    console.error('[pix imperium] excecao:', e);
    return NextResponse.json({ error: e?.message || 'Erro interno' }, { status: 500, headers });
  }
}
