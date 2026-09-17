'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Clock, Coffee } from 'lucide-react';
import { CESTAS } from '@/lib/flores-cestas';
import { COR_PRIMARIA, COR_SOFT, COR_DEEP, NOME_LOJA } from '@/lib/flores-produtos';
import Sacola from '@/components/Sacola';
import LogoRosas from '@/components/LogoRosas';

function useCarrinho() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('flores_carrinho');
        const arr = raw ? JSON.parse(raw) : [];
        setCount(arr.reduce((s: number, i: any) => s + (i.qtd || 1), 0));
      } catch { setCount(0); }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('carrinho-atualizado', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('carrinho-atualizado', load);
    };
  }, []);
  return count;
}

export default function CestasCafeManhaPage() {
  const carrinhoCount = useCarrinho();

  const adicionar = (produto: any) => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      const arr = raw ? JSON.parse(raw) : [];
      const existe = arr.find((i: any) => i.slug === produto.slug);
      if (existe) existe.qtd += 1;
      else arr.push({ slug: produto.slug, nome: produto.nome, preco: produto.preco, imagem: produto.imagem, qtd: 1 });
      localStorage.setItem('flores_carrinho', JSON.stringify(arr));
      window.dispatchEvent(new Event('carrinho-atualizado'));
      window.dispatchEvent(new Event('sacola-abrir'));
    } catch {}
  };

  return (
    <main style={{ minHeight: '100vh', background: '#FFF', fontFamily: "'Inter', system-ui, sans-serif", color: '#111' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&display=swap" rel="stylesheet" />

      {/* Topbar */}
      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      {/* Header */}
      <header style={{ background: '#FFF', borderBottom: '1px solid #F1E4E4', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event('sacola-abrir'))}
            style={{ position: 'relative', textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ padding: '10px 16px', background: COR_PRIMARIA, color: '#FFF', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <ShoppingCart size={16} />
              Sacola
              {carrinhoCount > 0 && (
                <span style={{ background: '#FFF', color: COR_PRIMARIA, borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{carrinhoCount}</span>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Cabecalho da categoria — mais elegante e compacto */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: COR_SOFT, color: COR_DEEP, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <Coffee size={12} /> Categoria
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, margin: 0, letterSpacing: '-0.01em', color: '#1a0f0f' }}>
          Cestas de café da manhã
        </h1>
        <p style={{ fontSize: 15, color: '#5a4747', marginTop: 10, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Cestas montadas à mão com produtos selecionados. Entrega expressa ou agendada, com atendimento das 06:30 às 22:30.
        </p>
      </section>

      {/* Grid de cestas */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, margin: 0, color: '#1a0f0f', letterSpacing: '-0.01em' }}>
            Todas as cestas
          </h2>
          <span style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>({CESTAS.length} opções)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {CESTAS.map((p) => (
            <div
              key={p.slug}
              style={{ background: '#FFF', borderRadius: 14, overflow: 'hidden', border: '1px solid #F1E4E4', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(220,38,38,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#FAFAF7' }}>
                <img src={p.imagem} alt={p.nome} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a0f0f', marginBottom: 10, lineHeight: 1.3, minHeight: 34 }}>{p.nome}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: COR_PRIMARIA, marginBottom: 12, letterSpacing: '-0.02em' }}>R$ {p.preco},00</div>
                <button
                  onClick={() => adicionar(p)}
                  style={{ display: 'block', width: '100%', padding: '10px', background: '#FFF', color: COR_PRIMARIA, border: `1.5px solid ${COR_PRIMARIA}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FAFAFA', borderTop: '1px solid #F1E4E4', padding: '40px 20px 24px', color: '#555' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LogoRosas height={44} />
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: '#888' }}>
            © 2026 {NOME_LOJA} · Entrega expressa ou agendada
          </div>
        </div>
      </footer>

      {/* Sacola drawer */}
      <Sacola />
    </main>
  );
}
