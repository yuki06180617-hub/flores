'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT, COR_DEEP } from '@/lib/flores-produtos';
import LogoRosas from '@/components/LogoRosas';

type Item = { slug: string; nome: string; preco: number; imagem: string; qtd: number };

export default function Carrinho() {
  const [itens, setItens] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      setItens(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  const salvar = (novo: Item[]) => {
    setItens(novo);
    localStorage.setItem('flores_carrinho', JSON.stringify(novo));
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const alterarQtd = (slug: string, delta: number) => {
    const novo = itens.map(i => i.slug === slug ? { ...i, qtd: Math.max(1, i.qtd + delta) } : i);
    salvar(novo);
  };

  const remover = (slug: string) => salvar(itens.filter(i => i.slug !== slug));

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  return (
    <main style={{ minHeight: '100vh', background: '#FFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F1E4E4', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Continuar comprando
        </Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Seu Carrinho</h1>

        {itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#FAFAFA', borderRadius: 16 }}>
            <ShoppingCart size={48} color="#CCC" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>Seu carrinho está vazio</div>
            <Link href="/" style={{ display: 'inline-block', padding: '12px 24px', background: COR_PRIMARIA, color: '#FFF', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 12 }}>
              {itens.map((item) => (
                <div key={item.slug} style={{ display: 'flex', gap: 16, padding: 16, background: '#FFF', border: '1px solid #F1E4E4', borderRadius: 12, alignItems: 'center' }}>
                  <img src={item.imagem} alt={item.nome} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: COR_SOFT, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.nome}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: COR_PRIMARIA }}>R$ {item.preco},00</div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #E5E5E5', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => alterarQtd(item.slug, -1)} style={{ background: '#FFF', border: 'none', padding: '8px 10px', cursor: 'pointer' }}><Minus size={12} /></button>
                    <div style={{ padding: '0 12px', fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qtd}</div>
                    <button onClick={() => alterarQtd(item.slug, 1)} style={{ background: '#FFF', border: 'none', padding: '8px 10px', cursor: 'pointer' }}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => remover(item.slug)} style={{ background: '#FEE2E2', border: 'none', padding: 10, borderRadius: 8, cursor: 'pointer' }}>
                    <Trash2 size={16} color={COR_PRIMARIA} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 20, background: COR_SOFT, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: '#555' }}>Subtotal</span>
                <span style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>R$ {total},00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#555' }}>Frete</span>
                <span style={{ fontSize: 14, color: '#059669', fontWeight: 700 }}>Grátis</span>
              </div>
              <div style={{ height: 1, background: '#F1E4E4', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: COR_PRIMARIA }}>R$ {total},00</span>
              </div>
            </div>

            <Link href="/checkout" style={{ display: 'block', marginTop: 20, padding: '16px', background: COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
              Finalizar pedido
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
