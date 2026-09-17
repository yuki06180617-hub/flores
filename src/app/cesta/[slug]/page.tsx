'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ChevronLeft, Minus, Plus, Truck, Clock, ShieldCheck, Coffee } from 'lucide-react';
import { CESTAS } from '@/lib/flores-cestas';
import { COR_PRIMARIA, COR_SOFT, COR_DEEP, NOME_LOJA } from '@/lib/flores-produtos';
import Sacola from '@/components/Sacola';
import LogoRosas from '@/components/LogoRosas';

export default function CestaIndividual() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const produto = CESTAS.find(p => p.slug === slug);
  const [qtd, setQtd] = useState(1);
  const [carrinhoCount, setCarrinhoCount] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('flores_carrinho');
        const arr = raw ? JSON.parse(raw) : [];
        setCarrinhoCount(arr.reduce((s: number, i: any) => s + (i.qtd || 1), 0));
      } catch {}
    };
    load();
    window.addEventListener('carrinho-atualizado', load);
    return () => window.removeEventListener('carrinho-atualizado', load);
  }, []);

  if (!produto) return (
    <main style={{ padding: 60, textAlign: 'center' }}>
      <h1>Cesta não encontrada</h1>
      <Link href="/cesta-cafe-da-manha">Voltar</Link>
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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F1E4E4', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event('sacola-abrir'))}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ padding: '10px 16px', background: COR_PRIMARIA, color: '#FFF', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <ShoppingCart size={16} /> Sacola
              {carrinhoCount > 0 && <span style={{ background: '#FFF', color: COR_PRIMARIA, borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{carrinhoCount}</span>}
            </div>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Link href="/cesta-cafe-da-manha" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar às cestas
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
          <div style={{ background: '#FAFAF7', borderRadius: 16, overflow: 'hidden' }}>
            <img src={produto.imagem} alt={produto.nome} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: COR_SOFT, color: COR_DEEP, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <Coffee size={11} /> Cesta de café da manhã
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 600, margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#1a0f0f' }}>{produto.nome}</h1>

            <div style={{ fontSize: 36, fontWeight: 900, color: COR_PRIMARIA, marginTop: 16, letterSpacing: '-0.02em' }}>R$ {produto.preco},00</div>

            {produto.descricao && (
              <div style={{ marginTop: 20, padding: 18, background: '#FAFAF7', borderRadius: 12, border: '1px solid #F0EDE8' }}>
                <div style={{ fontSize: 11, color: '#8a6a6a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Sobre a cesta</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7 }}>{produto.descricao}</div>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Quantidade</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #E5E5E5', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQtd(Math.max(1, qtd - 1))} style={{ background: '#FFF', border: 'none', padding: '10px 14px', cursor: 'pointer' }}><Minus size={14} /></button>
                <div style={{ padding: '0 20px', fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{qtd}</div>
                <button onClick={() => setQtd(qtd + 1)} style={{ background: '#FFF', border: 'none', padding: '10px 14px', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
            </div>

            <button onClick={adicionar} style={{ width: '100%', marginTop: 24, padding: '16px', background: COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              Adicionar ao carrinho · R$ {produto.preco * qtd},00
            </button>

            <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
              {[
                { icone: Truck, txt: 'Entrega expressa ou agendada' },
                { icone: ShieldCheck, txt: 'Cesta montada no dia da entrega' },
                { icone: Clock, txt: 'Atendimento das 06:30 às 22:30' },
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
