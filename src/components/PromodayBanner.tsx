'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Clock } from 'lucide-react';
import { PRODUTOS, COR_PRIMARIA, COR_DEEP, precoFinalPix, percentualDesconto } from '@/lib/flores-produtos';

const GREEN = '#059669';

// Produto em promoday: o marcado com precoPromoday no lib
function pegarProdutoPromoday() {
  return PRODUTOS.find(p => p.precoPromoday);
}

function useCronometro() {
  const [tempo, setTempo] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calcular = () => {
      const agora = new Date();
      const fim = new Date();
      fim.setHours(23, 59, 59, 999);
      const diff = fim.getTime() - agora.getTime();
      if (diff <= 0) return { h: 0, m: 0, s: 0 };
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      return { h, m, s };
    };
    setTempo(calcular());
    const t = setInterval(() => setTempo(calcular()), 1000);
    return () => clearInterval(t);
  }, []);

  return tempo;
}

export default function PromodayBanner({ onAdicionar }: { onAdicionar?: (produto: any) => void }) {
  const produto = pegarProdutoPromoday();
  const { h, m, s } = useCronometro();

  if (!produto || !produto.precoPromoday) return null;

  const precoPix = precoFinalPix(produto);
  const desconto = percentualDesconto(produto.preco, precoPix);

  const fmt = (n: number) => n.toString().padStart(2, '0');

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto 24px', padding: '0 20px' }}>
      <div style={{
        background: `linear-gradient(135deg, #1a0f0f 0%, #3a1010 100%)`,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px -12px rgba(153,27,27,0.3)',
      }}>
        {/* Padrao decorativo de fundo */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 20% 50%, #FFF 0%, transparent 40%), radial-gradient(circle at 80% 50%, #FFF 0%, transparent 40%)' }} />

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: 0 }} className="promoday-grid">
          {/* Imagem produto */}
          <div style={{ position: 'relative', minHeight: 240, background: `#000` }}>
            <img
              src={produto.imagem}
              alt={produto.nome}
              style={{ width: '100%', height: '100%', minHeight: 240, objectFit: 'cover', display: 'block', opacity: 0.95 }}
            />
            {/* Badge desconto no canto */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              background: COR_PRIMARIA, color: '#FFF',
              padding: '8px 12px', borderRadius: 10,
              fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              −{desconto}%
            </div>
          </div>

          {/* Conteudo */}
          <div style={{ padding: '24px 22px 26px', color: '#FFF' }}>
            {/* Label PROMODAY */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', padding: '5px 12px', borderRadius: 999, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', marginBottom: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Flame size={12} color="#FFB020" />
              <span style={{ color: '#FFB020' }}>PROMODAY · OFERTA DO DIA</span>
            </div>

            {/* Titulo */}
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, lineHeight: 1.15, marginBottom: 12 }}>
              {produto.nome}
            </div>

            {/* Precos */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', textDecoration: 'line-through' }}>de R$ {produto.preco},00</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>por</span>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#4ADE80', letterSpacing: '-0.02em', lineHeight: 1 }}>R$ {precoPix}</span>
            </div>
            <div style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700, marginBottom: 18 }}>no PIX à vista</div>

            {/* Cronometro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(0,0,0,0.35)', borderRadius: 10, marginBottom: 18, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Clock size={16} color="#FFB020" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Expira em</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 20, fontWeight: 900, fontFamily: "'Inter', monospace", letterSpacing: '0.02em', color: '#FFF' }}>
                  <span>{fmt(h)}</span>
                  <span style={{ color: '#FFB020' }}>:</span>
                  <span>{fmt(m)}</span>
                  <span style={{ color: '#FFB020' }}>:</span>
                  <span>{fmt(s)}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'grid', gap: 10 }}>
              <button
                onClick={() => onAdicionar?.(produto)}
                style={{ padding: '15px', background: '#FFB020', color: '#1a0f0f', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.03em' }}
              >
                Aproveitar oferta agora →
              </button>
              <Link
                href={`/produto/${produto.slug}`}
                style={{ padding: '13px', background: 'rgba(255,255,255,0.08)', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 720px) {
          .promoday-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .promoday-grid > div:first-child {
            min-height: 380px !important;
          }
        }
      `}</style>
    </section>
  );
}
