'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { COR_PRIMARIA, COR_SOFT } from '@/lib/flores-produtos';

type Item = { slug: string; nome: string; preco: number; imagem: string; qtd: number };

export default function Sacola() {
  const [aberto, setAberto] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);

  const carregar = () => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      setItens(raw ? JSON.parse(raw) : []);
    } catch { setItens([]); }
  };

  useEffect(() => {
    carregar();
    const openHandler = () => { carregar(); setAberto(true); };
    const updateHandler = () => carregar();
    window.addEventListener('sacola-abrir', openHandler);
    window.addEventListener('carrinho-atualizado', updateHandler);
    window.addEventListener('storage', updateHandler);
    return () => {
      window.removeEventListener('sacola-abrir', openHandler);
      window.removeEventListener('carrinho-atualizado', updateHandler);
      window.removeEventListener('storage', updateHandler);
    };
  }, []);

  useEffect(() => {
    // Bloqueia scroll do body quando drawer aberto
    if (aberto) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  const alterarQtd = (slug: string, delta: number) => {
    const novo = itens.map(i => i.slug === slug ? { ...i, qtd: Math.max(1, i.qtd + delta) } : i);
    setItens(novo);
    localStorage.setItem('flores_carrinho', JSON.stringify(novo));
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const remover = (slug: string) => {
    const novo = itens.filter(i => i.slug !== slug);
    setItens(novo);
    localStorage.setItem('flores_carrinho', JSON.stringify(novo));
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  if (!aberto) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setAberto(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(26,15,15,0.55)',
          zIndex: 100, animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(420px, 100vw)',
          background: '#FFF', zIndex: 101,
          display: 'flex', flexDirection: 'column',
          animation: 'slideIn 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: '-8px 0 30px -8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0DDDD', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} /> Sua sacola
          </div>
          <button onClick={() => setAberto(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#666', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Lista de itens */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {itens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#8a6a6a' }}>
              <ShoppingBag size={40} color="#D5B8B8" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: 14 }}>Sua sacola está vazia</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {itens.map((item) => (
                <div key={item.slug} style={{ display: 'flex', gap: 12 }}>
                  <img src={item.imagem} alt={item.nome} style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8, background: COR_SOFT, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a0f0f', lineHeight: 1.3, marginBottom: 4 }}>{item.nome}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COR_PRIMARIA }}>R$ {item.preco},00</div>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'inline-flex', border: '1px solid #E5E5E5', borderRadius: 6, overflow: 'hidden' }}>
                        <button onClick={() => alterarQtd(item.slug, -1)} style={{ padding: '4px 10px', background: '#FFF', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#555' }}>−</button>
                        <div style={{ padding: '4px 12px', fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qtd}</div>
                        <button onClick={() => alterarQtd(item.slug, 1)} style={{ padding: '4px 10px', background: '#FFF', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#555' }}>+</button>
                      </div>
                      <button onClick={() => remover(item.slug)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: 6, borderRadius: 6, display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div style={{ padding: '18px 24px', borderTop: '1px solid #F0DDDD', background: '#FAFAF7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, fontSize: 14 }}>
              <span style={{ color: '#555', fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: COR_PRIMARIA }}>R$ {subtotal},00</span>
            </div>
            <div style={{ fontSize: 11, color: '#8a6a6a', marginBottom: 14 }}>
              Frete e agendamento na próxima etapa.
            </div>
            <Link
              href="/checkout"
              onClick={() => setAberto(false)}
              style={{
                display: 'block', padding: '14px', background: COR_PRIMARIA,
                color: '#FFF', textAlign: 'center', borderRadius: 10,
                fontSize: 14, fontWeight: 800, textDecoration: 'none', marginBottom: 8,
              }}
            >
              Finalizar compra
            </Link>
            <button
              onClick={() => setAberto(false)}
              style={{
                display: 'block', width: '100%', padding: '12px',
                background: 'transparent', color: '#555',
                border: '1px solid #E5E5E5', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
