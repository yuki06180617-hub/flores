'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Clock } from 'lucide-react';
import { PRODUTOS, COR_PRIMARIA, COR_DEEP, precoFinalPix, percentualDesconto } from '@/lib/flores-produtos';

const GREEN = '#059669';
const UNIDADES_RESTANTES = 2;

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
    <section style={{ maxWidth: 900, margin: '0 auto 20px', padding: '0 20px' }}>
      <div style={{
        background: `linear-gradient(135deg, #1a0f0f 0%, #3a1010 100%)`,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 12px 30px -10px rgba(153,27,27,0.25)',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 20% 50%, #FFF 0%, transparent 40%), radial-gradient(circle at 80% 50%, #FFF 0%, transparent 40%)' }} />

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: 0 }} className="promoday-grid">
          {/* Imagem */}
          <div style={{ position: 'relative', minHeight: 170, background: '#000' }}>
            <img
              src={produto.imagem}
              alt={produto.nome}
              style={{ width: '100%', height: '100%', minHeight: 170, objectFit: 'cover', display: 'block', opacity: 0.95 }}
            />
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: COR_PRIMARIA, color: '#FFF',
              padding: '5px 10px', borderRadius: 8,
              fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}>
              −{desconto}%
            </div>
          </div>

          {/* Conteudo */}
          <div style={{ padding: '18px 18px 20px', color: '#FFF' }}>
            {/* Label PROMODAY + Unidades restantes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.10)', padding: '4px 10px', borderRadius: 999, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Flame size={10} color="#FFB020" />
                <span style={{ color: '#FFB020' }}>PROMODAY</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(220,38,38,0.25)', padding: '4px 10px', borderRadius: 999, fontSize: 9, fontWeight: 900, letterSpacing: '0.06em', border: '1px solid rgba(220,38,38,0.5)', color: '#FCA5A5' }}>
                <span>{UNIDADES_RESTANTES} UND. RESTANTES</span>
              </div>
            </div>

            {/* Titulo */}
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, lineHeight: 1.2, marginBottom: 10 }}>
              {produto.nome}
            </div>

            {/* Precos numa linha so */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>de R$ {produto.preco},00</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>por</span>
                <span style={{ fontSize: 30, fontWeight: 900, color: '#4ADE80', letterSpacing: '-0.02em', lineHeight: 1 }}>R$ {precoPix}</span>
                <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>no PIX</span>
              </div>
            </div>

            {/* Cronometro compacto */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <Clock size={13} color="#FFB020" />
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Expira em</div>
              <div style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.02em', color: '#FFF', display: 'flex', gap: 2 }}>
                <span>{fmt(h)}</span>
                <span style={{ color: '#FFB020' }}>:</span>
                <span>{fmt(m)}</span>
                <span style={{ color: '#FFB020' }}>:</span>
                <span>{fmt(s)}</span>
              </div>
            </div>

            {/* CTA unico compacto */}
            <button
              onClick={() => onAdicionar?.(produto)}
              style={{ width: '100%', padding: '12px', background: '#FFB020', color: '#1a0f0f', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.02em' }}
            >
              Aproveitar oferta agora →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 720px) {
          .promoday-grid {
            grid-template-columns: 220px 1fr !important;
          }
          .promoday-grid > div:first-child {
            min-height: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
