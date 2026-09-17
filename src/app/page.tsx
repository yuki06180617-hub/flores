'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Clock, Truck } from 'lucide-react';
import { PRODUTOS, CATEGORIAS, NOME_LOJA, TAGLINE, COR_PRIMARIA, COR_SOFT, COR_DEEP, precoComPix, precoFinalPix, percentualDesconto } from '@/lib/flores-produtos';
import CepEntrega from '@/components/CepEntrega';
import LogoRosas from '@/components/LogoRosas';
import Sacola from '@/components/Sacola';
import { estaAberto, proximaAbertura } from '@/lib/flores-horario';

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
    return () => { window.removeEventListener('storage', load); window.removeEventListener('carrinho-atualizado', load); };
  }, []);
  return count;
}

export default function HomeFlores() {
  const [filtro, setFiltro] = useState<string>('todos');
  const carrinhoCount = useCarrinho();

  const produtosFiltradosBase = filtro === 'todos' ? PRODUTOS : PRODUTOS.filter(p => p.categoria === filtro);
  // Promoday sempre primeiro
  const produtosFiltrados = [...produtosFiltradosBase].sort((a, b) => {
    if (a.precoPromoday && !b.precoPromoday) return -1;
    if (!a.precoPromoday && b.precoPromoday) return 1;
    return 0;
  });

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
      <link rel="preload" as="image" href="https://lucsfucvurjqrtdbmnqb.supabase.co/storage/v1/object/public/landing-assets/hero-flores.webp" fetchPriority="high" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      {/* Topbar */}
      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      {/* Header */}
      <header style={{ background: '#FFF', borderBottom: `1px solid #F1E4E4`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <LogoRosas height={48} />
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

      {/* Hero */}
      <section style={{
        position: 'relative',
        backgroundColor: '#3a1f1f',
        backgroundImage: 'linear-gradient(rgba(26,15,15,0.55), rgba(26,15,15,0.45)), url("https://lucsfucvurjqrtdbmnqb.supabase.co/storage/v1/object/public/landing-assets/hero-flores.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '80px 20px 72px',
        textAlign: 'center',
        color: '#FFF',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.95)', color: COR_DEEP, padding: '8px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, marginBottom: 24, letterSpacing: '0.06em', textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>
            <Truck size={13} /> Entrega grátis · Receba em até 1h
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 500, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.05, color: '#FFF', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Flores, Buquês, Combos e <span style={{ fontStyle: 'italic', color: '#FFD4D4', fontWeight: 600 }}>muito mais</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.92)', marginTop: 18, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, textShadow: '0 1px 12px rgba(0,0,0,0.3)' }}>
            Buquês, cestas e presentes selecionados à mão. Entrega expressa ou agendada, com atendimento das 06:30 às 22:30 e possibilidade de hora marcada.
          </p>
        </div>
      </section>

      {/* Campo CEP + tempo de entrega */}
      <section style={{ padding: '48px 20px 24px', background: '#FAFAF7' }}>
        <CepEntrega />
      </section>

      {/* Filtros de categoria */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 24px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setFiltro('todos')} style={{ padding: '10px 18px', border: `1.5px solid ${filtro === 'todos' ? COR_PRIMARIA : '#E5E5E5'}`, background: filtro === 'todos' ? COR_PRIMARIA : '#FFF', color: filtro === 'todos' ? '#FFF' : '#555', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Todos
        </button>
        {Object.entries(CATEGORIAS).map(([key, label]) => (
          <button key={key} onClick={() => setFiltro(key)} style={{ padding: '10px 18px', border: `1.5px solid ${filtro === key ? COR_PRIMARIA : '#E5E5E5'}`, background: filtro === key ? COR_PRIMARIA : '#FFF', color: filtro === key ? '#FFF' : '#555', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </section>

      {/* Grid de produtos */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 500, margin: '0 0 20px', color: '#1a0f0f', letterSpacing: '-0.01em' }}>
          {filtro === 'todos' ? 'Mais pedidos' : CATEGORIAS[filtro as keyof typeof CATEGORIAS]}
          <span style={{ fontSize: 13, color: '#999', fontWeight: 500, marginLeft: 8 }}>({produtosFiltrados.length} produtos)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {produtosFiltrados.map((p) => (
            <div key={p.slug} style={{ background: '#FFF', borderRadius: 14, overflow: 'hidden', border: '1px solid #F1E4E4', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(220,38,38,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <Link href={`/produto/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: COR_SOFT }}>
                  <img src={p.imagem} alt={p.nome} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.precoPromoday && (
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ background: '#1a0f0f', color: '#FFB020', padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', border: '1px solid rgba(255,176,32,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        🔥 PROMODAY
                      </div>
                      <div style={{ background: COR_PRIMARIA, color: '#FFF', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 900, letterSpacing: '-0.02em', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: 'fit-content' }}>
                        −{percentualDesconto(p.preco, p.precoPromoday)}%
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3, minHeight: 36 }}>{p.nome}</div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#999', textDecoration: 'line-through', fontWeight: 500 }}>R$ {p.preco}</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>R$ {precoFinalPix(p)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginTop: 2 }}>
                      {p.precoPromoday ? `${percentualDesconto(p.preco, p.precoPromoday)}% off · PROMODAY` : '13% off no PIX'}
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); adicionar(p); }}
                style={{ display: 'block', width: 'calc(100% - 32px)', margin: '0 16px 16px', padding: '10px', background: '#FFF', color: COR_PRIMARIA, border: `1.5px solid ${COR_PRIMARIA}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Adicionar ao carrinho
              </button>
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
          <Sacola />
    </main>
  );
}
