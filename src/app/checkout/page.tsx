'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT, COR_DEEP } from '@/lib/flores-produtos';
import LogoRosas from '@/components/LogoRosas';

type Item = { slug: string; nome: string; preco: number; qtd: number };

const GREEN = '#059669';
const PIX_LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><text x="0" y="30" font-family="Arial" font-size="28" font-weight="900" fill="#32BCAD">Pix</text></svg>`);

export default function CheckoutPage() {
  const router = useRouter();
  const [itens, setItens] = useState<Item[]>([]);
  const [dados, setDados] = useState({ nome: '', cpf: '', email: '', telefone: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', complemento: '', destinatario: '', mensagem: '' });
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      const arr = raw ? JSON.parse(raw) : [];
      if (arr.length === 0) { router.push('/carrinho'); return; }
      setItens(arr);
      // Preenche CEP salvo do card CEP na home
      const cepSalvo = localStorage.getItem('flores_cep');
      if (cepSalvo) {
        try {
          const c = JSON.parse(cepSalvo);
          setDados(d => ({
            ...d,
            cep: c.cep || '',
            rua: c.logradouro || '',
            bairro: c.bairro || '',
            cidade: c.localidade || '',
            uf: c.uf || '',
          }));
        } catch {}
      }
    } catch {}
  }, [router]);

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  const formatarCPF = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const formatarTel = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const gerarPix = async () => {
    setErro('');
    if (!dados.nome.trim()) { setErro('Digite seu nome'); return; }
    if (dados.cpf.replace(/\D/g, '').length !== 11) { setErro('CPF inválido'); return; }
    if (!dados.email.includes('@')) { setErro('Email inválido'); return; }
    if (dados.telefone.replace(/\D/g, '').length < 10) { setErro('Telefone inválido'); return; }
    if (!dados.cep || dados.cep.replace(/\D/g,'').length !== 8) { setErro('CEP inválido'); return; }
    if (!dados.rua.trim()) { setErro('Preencha a rua'); return; }
    if (!dados.numero.trim()) { setErro('Preencha o número'); return; }
    if (!dados.bairro.trim()) { setErro('Preencha o bairro'); return; }
    if (!dados.cidade.trim()) { setErro('Preencha a cidade'); return; }
    if (!dados.uf.trim() || dados.uf.length !== 2) { setErro('UF inválida'); return; }

    setGerando(true);
    try {
      // Salva dados do pedido pra usar depois
      localStorage.setItem('flores_pedido', JSON.stringify({ dados, itens, total }));

      const valorCentavos = total * 100;
      const resp = await fetch('/api/pix/imperium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: dados.nome,
          cpf: dados.cpf.replace(/\D/g, ''),
          email: dados.email,
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
        }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.sucesso) throw new Error(data.error || 'Erro ao gerar PIX');

      // Salva PIX na sessao pra pagina de pagamento usar
      localStorage.setItem('flores_pix', JSON.stringify(data));
      router.push('/pagamento?id=' + encodeURIComponent(data.transaction_id));
    } catch (e: any) {
      setErro(e.message || 'Erro ao gerar PIX');
    } finally {
      setGerando(false);
    }
  };

  const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'inherit', outline: 'none' };

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
        <Link href="/carrinho" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar ao carrinho
        </Link>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, marginBottom: 24, color: '#1a0f0f', letterSpacing: '-0.01em' }}>Finalizar Pedido</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 380px)', gap: 24, alignItems: 'flex-start' }}>
          {/* Esquerda: form */}
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Dados pessoais */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>1</span>
                Dados pessoais
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { key: 'nome', label: 'Nome completo', placeholder: 'Como aparece no CPF' },
                  { key: 'cpf', label: 'CPF', placeholder: '000.000.000-00', mask: formatarCPF },
                  { key: 'email', label: 'E-mail', placeholder: 'seu@email.com' },
                  { key: 'telefone', label: 'WhatsApp', placeholder: '(11) 99999-9999', mask: formatarTel },
                ].map((f: any) => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type="text" value={(dados as any)[f.key]} onChange={(e) => setDados({ ...dados, [f.key]: f.mask ? f.mask(e.target.value) : e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            {/* Endereco */}
            <div style={{ background: '#FFF', borderRadius: 14, padding: 24, border: '1px solid #F0DDDD' }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#1a0f0f', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>2</span>
                Endereço de entrega
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>CEP</label>
                  <input
                    type="text"
                    value={dados.cep}
                    onChange={async (e) => {
                      const v = formatarCep(e.target.value);
                      setDados({ ...dados, cep: v });
                      const l = v.replace(/\D/g, '');
                      if (l.length === 8) {
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
                      }
                    }}
                    placeholder="00000-000"
                    style={inputStyle}
                  />
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
                <span style={{ background: COR_PRIMARIA, color: '#FFF', width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>3</span>
                Forma de pagamento
              </div>

              {/* PIX (ativo) */}
              <div
                onClick={() => setMetodo('pix')}
                style={{
                  padding: 16,
                  border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#E5E5E5'}`,
                  borderRadius: 10,
                  background: metodo === 'pix' ? '#FFF8F8' : '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 10,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${metodo === 'pix' ? COR_PRIMARIA : '#CCC'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
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

              {/* Cartao (indisponivel) */}
              <div
                style={{
                  padding: 16,
                  border: '2px solid #EEE',
                  borderRadius: 10,
                  background: '#FAFAFA',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: 0.55,
                }}
              >
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

          {/* Direita: resumo */}
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

              <button
                onClick={gerarPix}
                disabled={gerando}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: gerando ? '#999' : COR_PRIMARIA,
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: gerando ? 'wait' : 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
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
