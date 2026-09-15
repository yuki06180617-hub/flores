'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, CreditCard, Lock, ShieldCheck, Truck, Calendar, Bell } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT } from '@/lib/flores-produtos';
import { proximosDiasComSlots } from '@/lib/flores-entrega';
import LogoRosas from '@/components/LogoRosas';

type Item = { slug: string; nome: string; preco: number; qtd: number };

const GREEN = '#059669';
const PIX_LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><text x="0" y="30" font-family="Arial" font-size="28" font-weight="900" fill="#32BCAD">Pix</text></svg>`);

export default function CheckoutPage() {
  const router = useRouter();
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
    // Default: primeiro dia com slots
    if (entregaTipo === 'agendada' && !entregaData && diasSlots.length > 0) {
      setEntregaData(diasSlots[0].data);
    }
  }, [entregaTipo, diasSlots, entregaData]);

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  const formatarCPF = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const formatarTel = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const gerarPix = async () => {
    setErro('');
    if (!dados.nome.trim()) { setErro('Digite seu nome'); return; }
    if (dados.cpf.replace(/\D/g, '').length !== 11) { setErro('CPF inválido'); return; }
    if (dados.telefone.replace(/\D/g, '').length < 10) { setErro('WhatsApp inválido'); return; }
    if (!dados.cep || dados.cep.replace(/\D/g, '').length !== 8) { setErro('CEP inválido'); return; }
    if (!dados.rua.trim()) { setErro('Preencha a rua'); return; }
    if (!dados.numero.trim()) { setErro('Preencha o número'); return; }
    if (!dados.bairro.trim()) { setErro('Preencha o bairro'); return; }
    if (!dados.cidade.trim()) { setErro('Preencha a cidade'); return; }
    if (!dados.uf.trim() || dados.uf.length !== 2) { setErro('UF inválida'); return; }
    if (entregaTipo === 'agendada' && (!entregaData || !entregaSlot)) { setErro('Escolha data e horário para entrega agendada'); return; }

    setGerando(true);
    try {
      const pedidoInfo = {
        dados, itens, total,
        entrega: { tipo: entregaTipo, data: entregaData, slot: entregaSlot },
        avisar_whatsapp: avisar,
      };
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
          endereco: {
            cep: dados.cep.replace(/\D/g, ''),
            rua: dados.rua,
            numero: dados.numero,
            bairro: dados.bairro,
            cidade: dados.cidade,
            uf: dados.uf.toUpperCase(),
            complemento: dados.complemento,
          },
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
    } finally {
      setGerando(false);
    }
  };

  const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'inherit', outline: 'none' };

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

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&display=swap" rel="stylesheet" />

      <div style={{ background: '#1a0f0f', color: '#FFF', padding: '9px 20px', fontSize: 12, textAlign: 'center' }}>
        Entrega das 06:30 às 22:30 · Entrega expressa ou agendada
      </div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F0DDDD', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock size={14} color={GREEN} /> Ambiente seguro · Compra protegida
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Continuar comprando
        </Link>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, marginBottom: 24, color: '#1a0f0f', letterSpacing: '-0.01em' }}>Finalizar Pedido</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 380px)', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Dados pessoais */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>1</span>
                Seus dados
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Nome completo</label>
                  <input type="text" value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} placeholder="Como aparece no CPF" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>CPF</label>
                  <input type="text" value={dados.cpf} onChange={(e) => setDados({ ...dados, cpf: formatarCPF(e.target.value) })} placeholder="000.000.000-00" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>WhatsApp</label>
                  <input type="text" value={dados.telefone} onChange={(e) => setDados({ ...dados, telefone: formatarTel(e.target.value) })} placeholder="(11) 99999-9999" style={inputStyle} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12, color: '#555', cursor: 'pointer' }}>
                    <input type="checkbox" checked={avisar} onChange={(e) => setAvisar(e.target.checked)} style={{ width: 16, height: 16, accentColor: COR_PRIMARIA, cursor: 'pointer' }} />
                    <Bell size={12} color={COR_PRIMARIA} />
                    <span>Quero ser avisado quando o pedido sair para entrega e for entregue</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Entrega */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>2</span>
                Entrega
              </div>

              <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                <div
                  onClick={() => setEntregaTipo('expressa')}
                  style={{
                    padding: 14, border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#E5E5E5'}`,
                    borderRadius: 10, background: entregaTipo === 'expressa' ? '#FFF8F8' : '#FFF',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {entregaTipo === 'expressa' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                  </div>
                  <Truck size={20} color={COR_PRIMARIA} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0f' }}>Entregar o quanto antes</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Em até 1 hora após pagamento</div>
                  </div>
                </div>

                <div
                  onClick={() => setEntregaTipo('agendada')}
                  style={{
                    padding: 14, border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#E5E5E5'}`,
                    borderRadius: 10, background: entregaTipo === 'agendada' ? '#FFF8F8' : '#FFF',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {entregaTipo === 'agendada' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                  </div>
                  <Calendar size={20} color={COR_PRIMARIA} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0f' }}>Agendar entrega</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Escolha data e horário</div>
                  </div>
                </div>
              </div>

              {entregaTipo === 'agendada' && (
                <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Escolha a data</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {diasSlots.map((d) => (
                      <button
                        key={d.data}
                        onClick={() => { setEntregaData(d.data); setEntregaSlot(''); }}
                        style={{
                          padding: '8px 14px', border: `1.5px solid ${entregaData === d.data ? COR_PRIMARIA : '#E5E5E5'}`,
                          background: entregaData === d.data ? COR_PRIMARIA : '#FFF',
                          color: entregaData === d.data ? '#FFF' : '#555',
                          borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {entregaData && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Escolha o horário</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                        {slotsDoDia.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => setEntregaSlot(s.value)}
                            style={{
                              padding: '9px 10px', border: `1.5px solid ${entregaSlot === s.value ? COR_PRIMARIA : '#E5E5E5'}`,
                              background: entregaSlot === s.value ? COR_PRIMARIA : '#FFF',
                              color: entregaSlot === s.value ? '#FFF' : '#555',
                              borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                        {slotsDoDia.length === 0 && (
                          <div style={{ fontSize: 12, color: '#8a6a6a' }}>Sem horários disponíveis para esta data.</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Endereco */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>3</span>
                Endereço de entrega
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>CEP</label>
                  <input type="text" value={dados.cep} onChange={(e) => { const v = formatarCep(e.target.value); setDados({ ...dados, cep: v }); consultarCep(v); }} placeholder="00000-000" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Rua</label>
                    <input type="text" value={dados.rua} onChange={(e) => setDados({ ...dados, rua: e.target.value })} placeholder="Nome da rua" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Número</label>
                    <input type="text" value={dados.numero} onChange={(e) => setDados({ ...dados, numero: e.target.value })} placeholder="123" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Bairro</label>
                  <input type="text" value={dados.bairro} onChange={(e) => setDados({ ...dados, bairro: e.target.value })} placeholder="Bairro" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Cidade</label>
                    <input type="text" value={dados.cidade} onChange={(e) => setDados({ ...dados, cidade: e.target.value })} placeholder="Cidade" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>UF</label>
                    <input type="text" value={dados.uf} onChange={(e) => setDados({ ...dados, uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="SP" style={inputStyle} maxLength={2} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Complemento (opcional)</label>
                  <input type="text" value={dados.complemento} onChange={(e) => setDados({ ...dados, complemento: e.target.value })} placeholder="Apto, bloco, referência" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Nome do destinatário (opcional)</label>
                  <input type="text" value={dados.destinatario} onChange={(e) => setDados({ ...dados, destinatario: e.target.value })} placeholder="Se for presente" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Mensagem no cartão (opcional)</label>
                  <textarea rows={3} value={dados.mensagem} onChange={(e) => setDados({ ...dados, mensagem: e.target.value })} placeholder="O que quer escrever?" style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Metodo de pagamento */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>4</span>
                Forma de pagamento
              </div>

              <div onClick={() => setMetodo('pix')} style={{ padding: 16, border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: metodo === 'pix' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {metodo === 'pix' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR_PRIMARIA }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={PIX_LOGO} alt="Pix" style={{ height: 22, width: 'auto' }} />
                    PIX
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Aprovação imediata · Sem taxas</div>
                </div>
                <div style={{ background: GREEN, color: '#FFF', padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>RECOMENDADO</div>
              </div>

              <div style={{ padding: 16, border: '2px solid #EEE', borderRadius: 10, background: '#FAFAFA', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.55 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #DDD' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#999', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CreditCard size={18} color="#999" />
                    Cartão de crédito
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Temporariamente indisponível</div>
                </div>
                <div style={{ background: '#EEE', color: '#666', padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>EM BREVE</div>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div>
            <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #F0DDDD', position: 'sticky', top: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCart size={16} /> Resumo do pedido
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900, color: COR_PRIMARIA, marginBottom: 20 }}>
                <span>Total</span><span>R$ {total},00</span>
              </div>

              {erro && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{erro}</div>}

              <button onClick={gerarPix} disabled={gerando} style={{ width: '100%', padding: '15px', background: gerando ? '#999' : COR_PRIMARIA, color: '#FFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: gerando ? 'wait' : 'pointer', letterSpacing: '0.02em' }}>
                {gerando ? 'Gerando PIX...' : 'Pagar com PIX'}
              </button>

              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={12} color={GREEN} /> Ambiente 100% seguro
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={12} color={GREEN} /> Seus dados são criptografados
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
