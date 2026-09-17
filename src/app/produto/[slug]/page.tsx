'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ChevronLeft, Minus, Plus, Truck, Clock, ShieldCheck } from 'lucide-react';
import { PRODUTOS, NOME_LOJA, TAGLINE, COR_PRIMARIA, COR_SOFT, COR_DEEP, precoFinalPix, percentualDesconto } from '@/lib/flores-produtos';
import Sacola from '@/components/Sacola';
import LogoRosas from '@/components/LogoRosas';

export default function ProdutoIndividual() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const produto = PRODUTOS.find(p => p.slug === slug);
  const [qtd, setQtd] = useState(1);
  const [carrinhoCount, setCarrinhoCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      const arr = raw ? JSON.parse(raw) : [];
      setCarrinhoCount(arr.reduce((s: number, i: any) => s + (i.qtd || 1), 0));
    } catch {}
  }, []);

  if (!produto) return (
    <main style={{ padding: 60, textAlign: 'center' }}>
      <h1>Produto não encontrado</h1>
      <Link href="/">Voltar</Link>
    </main>
  );

  const adicionar = () => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      const arr = raw ? JSON.parse(raw) : [];
      const existe = arr.find((i: any) => i.slug === produto.slug);
      if (existe) existe.qtd += qtd;
      else arr.push({ slug: produto.slug, nome: produto.nome, preco: produto.preco, imagem: produto.imagem, qtd });
      localStorage.setItem('flores_carrinho', JSON.stringify(arr));
      window.dispatchEvent(new Event('carrinho-atualizado'));
      window.dispatchEvent(new Event('sacola-abrir'));
    } catch {}
  };

  return (
    <main style={{ minHeight: '100vh', background: '#FFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F1E4E4', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event('sacola-abrir'))}
            style={{ textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ padding: '10px 16px', background: COR_PRIMARIA, color: '#FFF', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <ShoppingCart size={16} /> Sacola {carrinhoCount > 0 && <span style={{ background: '#FFF', color: COR_PRIMARIA, borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{carrinhoCount}</span>}
            </div>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar aos produtos
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
          <div style={{ background: COR_SOFT, borderRadius: 16, overflow: 'hidden' }}>
            <img src={produto.imagem} alt={produto.nome} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{produto.nome}</h1>

            <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-flex', width: 8, height: 8, borderRadius: '50%', background: '#059669' }} /> Disponível · Pronta entrega
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 20, color: '#999', textDecoration: 'line-through', fontWeight: 500 }}>R$ {produto.preco},00</span>
                <span style={{ fontSize: 36, fontWeight: 900, color: '#059669', letterSpacing: '-0.02em' }}>R$ {precoFinalPix(produto)}</span>
              </div>
              <div style={{ fontSize: 13, color: '#059669', fontWeight: 700, marginTop: 4 }}>
                {produto.precoPromoday
                  ? `PROMODAY · ${percentualDesconto(produto.preco, produto.precoPromoday)}% de desconto no PIX`
                  : '13% de desconto pagando no PIX'}
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: '#F9FAFB', borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                Um arranjo cuidadosamente montado com flores frescas, ideal para presentear em qualquer ocasião especial. Todas as flores são selecionadas no dia da entrega para garantir máxima qualidade.
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Quantidade</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #E5E5E5', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQtd(Math.max(1, qtd - 1))} style={{ background: '#FFF', border: 'none', padding: '10px 14px', cursor: 'pointer' }}><Minus size={14} /></button>
                <div style={{ padding: '0 20px', fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{qtd}</div>
                <button onClick={() => setQtd(qtd + 1)} style={{ background: '#FFF', border: 'none', padding: '10px 14px', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
            </div>

            <button onClick={adicionar} style={{ width: '100%', marginTop: 24, padding: '16px', background: COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              Adicionar ao carrinho · R$ {precoFinalPix(produto) * qtd} no PIX
            </button>

            <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
              {[
                { icone: Truck, txt: 'Entrega grátis em até 1 hora' },
                { icone: ShieldCheck, txt: 'Flores frescas garantidas' },
                { icone: Clock, txt: 'Atendimento 24 horas' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#555' }}>
                  <b.icone size={16} color={COR_PRIMARIA} /> {b.txt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
          <Sacola />
    </main>
  );
}
