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
    const { nome, cpf, email, telefone, valor, items, endereco } = body || {};

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
    const emailFallback = email || 'pedidos@rosamaria.com.br';
    const valorCentavos = parseInt(valor, 10);

    // Constroi items — todos com tangible: true (flores fisicas)
    // Calcula soma dos items (preco original) pra ajustar proporcionalmente ao valorCentavos
    // Isso garante que a soma de items[i].unitPrice * quantity == amount
    // (mesmo com desconto PIX aplicado)
    const somaOriginal = Array.isArray(items) && items.length > 0
      ? items.reduce((s, i) => s + (parseInt((i.preco || 0) * 100, 10) * parseInt(i.qtd || i.quantity || 1, 10)), 0)
      : valorCentavos;

    const fator = somaOriginal > 0 ? valorCentavos / somaOriginal : 1;

    const impItems = Array.isArray(items) && items.length > 0
      ? items.map((i) => ({
          title: (i.nome || i.title || 'Produto').slice(0, 100),
          unitPrice: Math.round(parseInt((i.preco || 0) * 100, 10) * fator) || valorCentavos,
          quantity: parseInt(i.qtd || i.quantity || 1, 10),
          tangible: true,
        }))
      : [{ title: 'Pedido Rosa Maria', unitPrice: valorCentavos, quantity: 1, tangible: true }];

    // Corrige diferenca de arredondamento no ultimo item pra bater exato com amount
    if (impItems.length > 0) {
      const somaFinal = impItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      const diff = valorCentavos - somaFinal;
      if (diff !== 0) {
        impItems[impItems.length - 1].unitPrice += Math.round(diff / impItems[impItems.length - 1].quantity);
      }
    }

    // Body seguindo docs oficiais
    const impBody = {
      amount: valorCentavos,
      paymentMethod: 'PIX',
      customer: {
        name: nome,
        email: emailFallback,
        document: {
          type: 'cpf',
          number: docNumber,
        },
        phone: phone,
      },
      items: impItems,
      postbackUrl: `${new URL(req.url).origin}/api/pix/imperium/webhook`,
      metadata: {
        source: 'rosa-maria-floricultura',
        entrega_tipo: body.entrega?.tipo || 'expressa',
        entrega_data: body.entrega?.data || '',
        entrega_slot: body.entrega?.slot || '',
        avisar_whatsapp: body.avisar_whatsapp ? 'sim' : 'nao',
        destinatario: body.destinatario || '',
        mensagem_cartao: body.mensagem || '',
      },
    };

    // Se tem endereco, adiciona shipping (obrigatorio pra tangible: true)
    if (endereco?.cep && endereco?.rua) {
      impBody.shipping = {
        street: endereco.rua,
        streetNumber: endereco.numero || 'S/N',
        complement: endereco.complemento || '',
        zipCode: (endereco.cep || '').replace(/\D/g, ''),
        neighborhood: endereco.bairro || '',
        city: endereco.cidade || '',
        state: (endereco.uf || 'SP').toUpperCase(),
        country: 'br',
      };
    }

    // URL correta: /api/sales (nao /v1/sales!)
    const impResp = await fetch('https://api.imperiumpay.com.br/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Public-Key': publicKey,
        'X-Api-Private-Key': privateKey,
      },
      body: JSON.stringify(impBody),
    });

    const data = await impResp.json();

    if (!impResp.ok) {
      console.error('[pix imperium] erro:', impResp.status, JSON.stringify(data));
      return NextResponse.json({
        error: data.message || data.error || 'Erro ao criar pagamento',
        status: impResp.status,
        detalhes: data,
      }, { status: impResp.status, headers });
    }

    const sale = data.sale || data;
    const pixInfo = sale.payment?.pix || {};
    const qrCode = pixInfo.qrCodeBase64;
    const copiaCola = pixInfo.key;
    const transactionId = String(sale.id || '');

    if (!transactionId) {
      console.error('[pix imperium] resposta sem id:', data);
      return NextResponse.json({ error: 'Resposta inesperada da Imperium', detalhes: data }, { status: 500, headers });
    }

    return NextResponse.json({
      sucesso: true,
      transaction_id: transactionId,
      pixCode: copiaCola,
      pixQrCodeImage: qrCode,
      valor: valorCentavos,
      expiresAt: pixInfo.expiresAt,
    }, { headers });
  } catch (e) {
    console.error('[pix imperium] excecao:', e);
    return NextResponse.json({ error: e?.message || 'Erro interno' }, { status: 500, headers });
  }
}
