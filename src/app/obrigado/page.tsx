'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA } from '@/lib/flores-produtos';
import LogoRosas from '@/components/LogoRosas';

const GREEN = '#059669';

function Content() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_pedido');
      if (raw) setPedido(JSON.parse(raw));
      // Limpa carrinho
      localStorage.removeItem('flores_carrinho');
      localStorage.removeItem('flores_pix');
      window.dispatchEvent(new Event('carrinho-atualizado'));
    } catch {}
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F0DDDD', padding: '16px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: '#FFF', borderRadius: 20, padding: '40px 32px', border: '1px solid #F0DDDD', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 24px', background: `linear-gradient(135deg, ${GREEN}, #047857)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -6px rgba(5,150,105,0.5)' }}>
            <CheckCircle2 size={44} color="#FFF" />
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#1a0f0f', margin: '0 0 12px' }}>Pagamento confirmado!</h1>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
            Recebemos seu pedido e ele já está sendo preparado com muito carinho. Você receberá atualizações pelo WhatsApp cadastrado.
          </p>

          {pedido && (
            <div style={{ background: '#FAFAF7', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#8a6a6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Detalhes do pedido</div>
              {pedido.itens?.map((i: any) => (
                <div key={i.slug} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#555' }}>{i.qtd}x {i.nome}</span>
                  <span style={{ fontWeight: 700 }}>R$ {i.preco * i.qtd},00</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#F0DDDD', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: COR_PRIMARIA }}>
                <span>Total</span><span>R$ {pedido.total},00</span>
              </div>
            </div>
          )}

          {tid && (
            <div style={{ fontSize: 11, color: '#8a6a6a', padding: '10px 14px', background: '#FAFAF7', borderRadius: 8, fontFamily: 'monospace', marginBottom: 20 }}>
              Nº do pedido: {tid}
            </div>
          )}

          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: COR_PRIMARIA, color: '#FFF', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Voltar à loja
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FAFAF7' }} />}>
      <Content />
    </Suspense>
  );
}
