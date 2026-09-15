'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Copy, CheckCheck, Clock, Lock, ChevronLeft } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT } from '@/lib/flores-produtos';
import LogoRosas from '@/components/LogoRosas';

const GREEN = '#059669';

function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [pix, setPix] = useState<any>(null);
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(15 * 60); // 15 min timer

  useEffect(() => {
    // Carrega dados do PIX gerado no checkout
    try {
      const raw = localStorage.getItem('flores_pix');
      if (raw) setPix(JSON.parse(raw));
    } catch {}
  }, []);

  // Timer regressivo
  useEffect(() => {
    if (tempoRestante <= 0) return;
    const t = setInterval(() => setTempoRestante(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [tempoRestante]);

  // Polling status
  useEffect(() => {
    if (!id) return;
    let stop = false;
    let timer: any = null;

    const check = async () => {
      if (stop) return;
      try {
        const r = await fetch('/api/pix/status?id=' + encodeURIComponent(id), { cache: 'no-store' });
        const d = await r.json();
        if (d.paid) {
          stop = true;
          window.location.href = '/obrigado?tid=' + encodeURIComponent(id);
          return;
        }
      } catch {}
      timer = setTimeout(check, 3000);
    };
    check();
    return () => { stop = true; if (timer) clearTimeout(timer); };
  }, [id]);

  const copiar = async () => {
    if (!pix?.pixCode) return;
    try {
      await navigator.clipboard.writeText(pix.pixCode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {}
  };

  const min = Math.floor(tempoRestante / 60);
  const sec = tempoRestante % 60;

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F0DDDD', padding: '16px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock size={14} color={GREEN} /> Pagamento seguro
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px' }}>
        <Link href="/checkout" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar
        </Link>

        <div style={{ background: '#FFF', borderRadius: 16, padding: 32, border: '1px solid #F0DDDD', textAlign: 'center' }}>
          <div style={{ marginBottom: 20, display: 'inline-block', padding: '6px 14px', background: '#FFF8F8', borderRadius: 999, fontSize: 11, fontWeight: 800, color: COR_PRIMARIA, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Expira em {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, margin: '0 0 8px', color: '#1a0f0f' }}>Pague com PIX</h1>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.5 }}>
            Abra o app do seu banco, escaneie o QR Code ou copie o código PIX abaixo. A confirmação é automática.
          </p>

          {pix?.pixQrCodeImage ? (
            <div style={{ display: 'inline-block', padding: 16, background: '#FFF', border: '2px solid #F0DDDD', borderRadius: 14, marginBottom: 20 }}>
              <img
                src={pix.pixQrCodeImage.startsWith('data:') ? pix.pixQrCodeImage : `data:image/png;base64,${pix.pixQrCodeImage}`}
                alt="QR Code PIX"
                style={{ width: 220, height: 220, display: 'block' }}
              />
            </div>
          ) : (
            <div style={{ padding: 40, background: '#FAFAF7', borderRadius: 14, marginBottom: 20, color: '#999', fontSize: 13 }}>
              Carregando QR Code...
            </div>
          )}

          {pix?.pixCode && (
            <>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Código copia-e-cola</div>
              <div style={{ padding: 12, background: '#FAFAF7', border: '1px solid #EEE', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, color: '#333', wordBreak: 'break-all', marginBottom: 12, maxHeight: 100, overflow: 'auto', textAlign: 'left' }}>
                {pix.pixCode}
              </div>
              <button
                onClick={copiar}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: copiado ? GREEN : COR_PRIMARIA,
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {copiado ? <><CheckCheck size={16} /> Código copiado!</> : <><Copy size={16} /> Copiar código PIX</>}
              </button>
            </>
          )}

          <div style={{ marginTop: 20, padding: 14, background: '#FFF8F8', borderRadius: 10, fontSize: 12, color: '#666' }}>
            ⏱️ Aguardando pagamento... Após pagar, você será redirecionado automaticamente.
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FAFAF7' }} />}>
      <Content />
    </Suspense>
  );
}
