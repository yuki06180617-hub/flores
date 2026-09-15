'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, CreditCard, Lock, ShieldCheck, Truck, Calendar, Bell, User, MapPin, CheckCircle2 } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT } from '@/lib/flores-produtos';
import { proximosDiasComSlots } from '@/lib/flores-entrega';
import LogoRosas from '@/components/LogoRosas';

type Item = { slug: string; nome: string; preco: number; qtd: number };

const GREEN = '#059669';
const PIX_LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><text x="0" y="30" font-family="Arial" font-size="28" font-weight="900" fill="#32BCAD">Pix</text></svg>`);

type Step = 1 | 2 | 3 | 4;

const STEPS: { n: Step; label: string; icone: any }[] = [
  { n: 1, label: 'Dados', icone: User },
  { n: 2, label: 'Entrega', icone: Truck },
  { n: 3, label: 'Endereço', icone: MapPin },
  { n: 4, label: 'Pagamento', icone: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [itens, setItens] = useState<Item[]>([]);
  const [dados, setDados] = useState({ nome: '', cpf: '', telefone: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', complemento: '', destinatario: '', mensagem: '' });
  const [avisar, setAvisar] = useState(true);
  const [entregaTipo, setEntregaTipo] = useState<'expressa' | 'agendada'>('expressa');
  const [entregaData, setEntregaData] = useState('');
  const [entregaSlot, setEntregaSlot] = useState('');
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState('');

  const diasSlots = proximosDiasComSlots();
  const slotsDoDia = diasSlots.find(d => d.data === entregaData)?.slots || [];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      const arr = raw ? JSON.parse(raw) : [];
      if (arr.length === 0) { router.push('/'); return; }
      setItens(arr);
      const cepSalvo = localStorage.getItem('flores_cep');
      if (cepSalvo) {
        try {
          const c = JSON.parse(cepSalvo);
          setDados(d => ({ ...d, cep: c.cep || '', rua: c.logradouro || '', bairro: c.bairro || '', cidade: c.localidade || '', uf: c.uf || '' }));
        } catch {}
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    if (entregaTipo === 'agendada' && !entregaData && diasSlots.length > 0) {
      setEntregaData(diasSlots[0].data);
    }
  }, [entregaTipo, diasSlots, entregaData]);

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  const formatarCPF = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const formatarTel = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const consultarCep = async (cepMasked: string) => {
    const l = cepMasked.replace(/\D/g, '');
    if (l.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${l}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setDados(prev => ({
          ...prev,
          rua: d.logradouro || prev.rua,
          bairro: d.bairro || prev.bairro,
          cidade: d.localidade || prev.cidade,
          uf: d.uf || prev.uf,
        }));
      }
    } catch {}
  };

  const validarStep1 = () => {
    if (!dados.nome.trim()) return 'Digite seu nome';
    if (dados.cpf.replace(/\D/g, '').length !== 11) return 'CPF inválido';
    if (dados.telefone.replace(/\D/g, '').length < 10) return 'WhatsApp inválido';
    return '';
  };
  const validarStep2 = () => {
    if (entregaTipo === 'agendada' && (!entregaData || !entregaSlot)) return 'Escolha data e horário para entrega agendada';
    return '';
  };
  const validarStep3 = () => {
    if (!dados.cep || dados.cep.replace(/\D/g, '').length !== 8) return 'CEP inválido';
    if (!dados.rua.trim()) return 'Preencha a rua';
    if (!dados.numero.trim()) return 'Preencha o número';
    if (!dados.bairro.trim()) return 'Preencha o bairro';
    if (!dados.cidade.trim()) return 'Preencha a cidade';
    if (!dados.uf.trim() || dados.uf.length !== 2) return 'UF inválida';
    return '';
  };

  const proximo = () => {
    let msg = '';
    if (step === 1) msg = validarStep1();
    else if (step === 2) msg = validarStep2();
    else if (step === 3) msg = validarStep3();
    if (msg) { setErro(msg); return; }
    setErro('');
    if (step < 4) setStep((step + 1) as Step);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const voltar = () => {
    setErro('');
    if (step > 1) setStep((step - 1) as Step);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gerarPix = async () => {
    setErro('');
    const m1 = validarStep1(); if (m1) { setStep(1); setErro(m1); return; }
    const m2 = validarStep2(); if (m2) { setStep(2); setErro(m2); return; }
    const m3 = validarStep3(); if (m3) { setStep(3); setErro(m3); return; }

    setGerando(true);
    try {
      const pedidoInfo = { dados, itens, total, entrega: { tipo: entregaTipo, data: entregaData, slot: entregaSlot }, avisar_whatsapp: avisar };
      localStorage.setItem('flores_pedido', JSON.stringify(pedidoInfo));

      const valorCentavos = total * 100;
      const resp = await fetch('/api/pix/imperium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: dados.nome,
          cpf: dados.cpf.replace(/\D/g, ''),
          telefone: dados.telefone.replace(/\D/g, ''),
          valor: valorCentavos,
          items: itens,
          endereco: { cep: dados.cep.replace(/\D/g, ''), rua: dados.rua, numero: dados.numero, bairro: dados.bairro, cidade: dados.cidade, uf: dados.uf.toUpperCase(), complemento: dados.complemento },
          entrega: { tipo: entregaTipo, data: entregaData, slot: entregaSlot },
          avisar_whatsapp: avisar,
          destinatario: dados.destinatario,
          mensagem: dados.mensagem,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.sucesso) throw new Error(data.error || 'Erro ao gerar PIX');
      localStorage.setItem('flores_pix', JSON.stringify(data));
      router.push('/pagamento?id=' + encodeURIComponent(data.transaction_id));
    } catch (e: any) {
      setErro(e.message || 'Erro ao gerar PIX');
    } finally { setGerando(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' as const, fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 };

  const StepIndicator = () => (
    <div style={{ background: '#FFF', borderRadius: 12, padding: '16px 12px', border: '1px solid #F0DDDD', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        {STEPS.map((s, idx) => {
          const isDone = step > s.n;
          const isActive = step === s.n;
          const Ico = isDone ? CheckCircle2 : s.icone;
          return (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: idx === STEPS.length - 1 ? '0' : '1', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isDone ? GREEN : (isActive ? COR_PRIMARIA : '#F0DDDD'),
                  color: isDone || isActive ? '#FFF' : '#8a6a6a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <Ico size={16} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? COR_PRIMARIA : (isDone ? GREEN : '#8a6a6a'), letterSpacing: '0.03em', textAlign: 'center' }}>{s.label}</div>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{ height: 2, background: step > s.n ? GREEN : '#F0DDDD', flex: 1, margin: '0 4px', marginBottom: 16 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F0DDDD', padding: '14px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={40} mostrarTagline={false} />
          </Link>
          <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <Lock size={13} color={GREEN} /> <span style={{ display: 'none' }} className="hide-mobile">Ambiente seguro</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => step === 1 ? router.push('/') : voltar()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, marginBottom: 16, padding: 0, fontFamily: 'inherit' }}>
          <ChevronLeft size={16} /> {step === 1 ? 'Continuar comprando' : 'Voltar'}
        </button>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, marginBottom: 16, color: '#1a0f0f', letterSpacing: '-0.01em' }}>Finalizar Pedido</h1>

        <StepIndicator />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16 }} className="checkout-grid">
          <div>
            {/* STEP 1 - DADOS PESSOAIS */}
            {step === 1 && (
              <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD' }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#1a0f0f' }}>Seus dados</div>
                <div style={{ fontSize: 12, color: '#8a6a6a', marginBottom: 20 }}>Precisamos deles para processar seu pedido</div>
                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Nome completo</label>
                    <input type="text" value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} placeholder="Como aparece no CPF" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CPF</label>
                    <input type="tel" inputMode="numeric" value={dados.cpf} onChange={(e) => setDados({ ...dados, cpf: formatarCPF(e.target.value) })} placeholder="000.000.000-00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp</label>
                    <input type="tel" inputMode="tel" value={dados.telefone} onChange={(e) => setDados({ ...dados, telefone: formatarTel(e.target.value) })} placeholder="(11) 99999-9999" style={inputStyle} />
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 12, padding: '10px 12px', background: '#FFF8F8', borderRadius: 8, cursor: 'pointer', border: `1px solid ${avisar ? COR_PRIMARIA + '40' : '#F0DDDD'}` }}>
                      <input type="checkbox" checked={avisar} onChange={(e) => setAvisar(e.target.checked)} style={{ width: 16, height: 16, accentColor: COR_PRIMARIA, cursor: 'pointer', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#1a0f0f', lineHeight: 1.4 }}>
                        <Bell size={12} color={COR_PRIMARIA} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        Quero ser avisado quando o pedido sair para entrega e for entregue
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 - ENTREGA */}
            {step === 2 && (
              <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD' }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#1a0f0f' }}>Entrega</div>
                <div style={{ fontSize: 12, color: '#8a6a6a', marginBottom: 20 }}>Como você quer receber?</div>

                <div style={{ display: 'grid', gap: 10, marginBottom: entregaTipo === 'agendada' ? 18 : 0 }}>
                  <div onClick={() => setEntregaTipo('expressa')} style={{ padding: 14, border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: entregaTipo === 'expressa' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {entregaTipo === 'expressa' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                    </div>
                    <Truck size={20} color={COR_PRIMARIA} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0f' }}>Entregar o quanto antes</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Em até 1 hora após pagamento</div>
                    </div>
                  </div>

                  <div onClick={() => setEntregaTipo('agendada')} style={{ padding: 14, border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: entregaTipo === 'agendada' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {entregaTipo === 'agendada' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                    </div>
                    <Calendar size={20} color={COR_PRIMARIA} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0f' }}>Agendar entrega</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Escolha data e horário</div>
                    </div>
                  </div>
                </div>

                {entregaTipo === 'agendada' && (
                  <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Data</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                      {diasSlots.map((d) => (
                        <button key={d.data} onClick={() => { setEntregaData(d.data); setEntregaSlot(''); }} style={{ padding: '8px 14px', border: `1.5px solid ${entregaData === d.data ? COR_PRIMARIA : '#E5E5E5'}`, background: entregaData === d.data ? COR_PRIMARIA : '#FFF', color: entregaData === d.data ? '#FFF' : '#555', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {entregaData && (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Horário</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: 8 }}>
                          {slotsDoDia.map((s) => (
                            <button key={s.value} onClick={() => setEntregaSlot(s.value)} style={{ padding: '10px 8px', border: `1.5px solid ${entregaSlot === s.value ? COR_PRIMARIA : '#E5E5E5'}`, background: entregaSlot === s.value ? COR_PRIMARIA : '#FFF', color: entregaSlot === s.value ? '#FFF' : '#555', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              {s.label}
                            </button>
                          ))}
                          {slotsDoDia.length === 0 && <div style={{ fontSize: 12, color: '#8a6a6a', gridColumn: '1/-1' }}>Sem horários disponíveis.</div>}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 - ENDERECO/RECEBIMENTO */}
            {step === 3 && (
              <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD' }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#1a0f0f' }}>Dados do recebimento</div>
                <div style={{ fontSize: 12, color: '#8a6a6a', marginBottom: 20 }}>Endereço + mensagem opcional</div>

                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>CEP</label>
                    <input type="tel" inputMode="numeric" value={dados.cep} onChange={(e) => { const v = formatarCep(e.target.value); setDados({ ...dados, cep: v }); consultarCep(v); }} placeholder="00000-000" style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Rua</label>
                      <input type="text" value={dados.rua} onChange={(e) => setDados({ ...dados, rua: e.target.value })} placeholder="Nome da rua" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Número</label>
                      <input type="text" value={dados.numero} onChange={(e) => setDados({ ...dados, numero: e.target.value })} placeholder="123" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Bairro</label>
                    <input type="text" value={dados.bairro} onChange={(e) => setDados({ ...dados, bairro: e.target.value })} placeholder="Bairro" style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Cidade</label>
                      <input type="text" value={dados.cidade} onChange={(e) => setDados({ ...dados, cidade: e.target.value })} placeholder="Cidade" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>UF</label>
                      <input type="text" value={dados.uf} onChange={(e) => setDados({ ...dados, uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="SP" style={inputStyle} maxLength={2} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Complemento (opcional)</label>
                    <input type="text" value={dados.complemento} onChange={(e) => setDados({ ...dados, complemento: e.target.value })} placeholder="Apto, bloco, referência" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nome do destinatário (opcional)</label>
                    <input type="text" value={dados.destinatario} onChange={(e) => setDados({ ...dados, destinatario: e.target.value })} placeholder="Se for presente" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Mensagem no cartão (opcional)</label>
                    <textarea rows={3} value={dados.mensagem} onChange={(e) => setDados({ ...dados, mensagem: e.target.value })} placeholder="O que quer escrever?" style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 - PAGAMENTO */}
            {step === 4 && (
              <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD' }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#1a0f0f' }}>Forma de pagamento</div>
                <div style={{ fontSize: 12, color: '#8a6a6a', marginBottom: 20 }}>Escolha como quer pagar</div>

                <div onClick={() => setMetodo('pix')} style={{ padding: 16, border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: metodo === 'pix' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {metodo === 'pix' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={PIX_LOGO} alt="Pix" style={{ height: 22, width: 'auto' }} />
                      PIX
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Aprovação imediata · Sem taxas</div>
                  </div>
                  <div style={{ background: GREEN, color: '#FFF', padding: '3px 8px', borderRadius: 12, fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', flexShrink: 0 }}>RECOMENDADO</div>
                </div>

                <div style={{ padding: 16, border: '2px solid #EEE', borderRadius: 10, background: '#FAFAFA', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.55 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #DDD', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#999', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard size={18} color="#999" />
                      Cartão de crédito
                    </div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Temporariamente indisponível</div>
                  </div>
                  <div style={{ background: '#EEE', color: '#666', padding: '3px 8px', borderRadius: 12, fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', flexShrink: 0 }}>EM BREVE</div>
                </div>

                {/* Resumo compacto pra revisao antes de pagar */}
                <div style={{ marginTop: 20, background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Revisão</div>
                  <div style={{ fontSize: 12, color: '#333', lineHeight: 1.6 }}>
                    <div><b>{dados.nome}</b> · {dados.telefone}</div>
                    <div style={{ marginTop: 4 }}>
                      {entregaTipo === 'expressa' ? 'Entrega expressa (até 1h)' : `Agendada para ${entregaData} · ${entregaSlot}`}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {dados.rua}, {dados.numero} · {dados.bairro} · {dados.cidade}/{dados.uf}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {erro && <div style={{ marginTop: 12, background: '#FEF2F2', color: '#B91C1C', padding: 12, borderRadius: 8, fontSize: 13 }}>{erro}</div>}

            {/* Botoes navegacao */}
            <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
              {step < 4 ? (
                <button onClick={proximo} style={{ width: '100%', padding: '16px', background: COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                  Continuar →
                </button>
              ) : (
                <button onClick={gerarPix} disabled={gerando} style={{ width: '100%', padding: '16px', background: gerando ? '#999' : COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: gerando ? 'wait' : 'pointer' }}>
                  {gerando ? 'Gerando PIX...' : `Pagar R$ ${total},00 com PIX`}
                </button>
              )}
              {step > 1 && (
                <button onClick={voltar} style={{ width: '100%', padding: '13px', background: 'transparent', color: '#666', border: '1px solid #E5E5E5', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  ← Voltar
                </button>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, color: '#8a6a6a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={12} color={GREEN} /> Ambiente seguro</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={12} color={GREEN} /> Criptografado</div>
            </div>
          </div>

          {/* Resumo lateral — SO desktop */}
          <div className="resumo-desktop" style={{ display: 'none' }}>
            <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD', position: 'sticky', top: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCart size={16} /> Resumo
              </div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
                {itens.map((item) => (
                  <div key={item.slug} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#555', flex: 1 }}>{item.qtd}x {item.nome}</span>
                    <span style={{ fontWeight: 700, whiteSpace: 'nowrap', color: '#1a0f0f' }}>R$ {item.preco * item.qtd},00</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: '#F0DDDD', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#555' }}>
                <span>Subtotal</span><span>R$ {total},00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13, color: GREEN, fontWeight: 700 }}>
                <span>Entrega</span><span>Grátis</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900, color: COR_PRIMARIA }}>
                <span>Total</span><span>R$ {total},00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo compacto — so mobile (bem no topo, dobradinho) */}
        <div className="resumo-mobile" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', padding: '10px 16px', borderTop: '1px solid #F0DDDD', boxShadow: '0 -4px 12px -2px rgba(0,0,0,0.05)', zIndex: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#8a6a6a' }}>
            <span>{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: COR_PRIMARIA }}>R$ {total},00</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 900px) {
          .checkout-grid { grid-template-columns: minmax(0, 1fr) 340px !important; gap: 24px !important; }
          .resumo-desktop { display: block !important; }
          .resumo-mobile { display: none !important; }
        }
        @media (max-width: 899px) {
          .resumo-mobile { display: block !important; }
        }
      `}</style>
    </main>
  );
}
