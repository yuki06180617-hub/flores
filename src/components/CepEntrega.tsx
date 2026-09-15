'use client';
import { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { estaAberto, janelaEntregaAte1h, horariosAgendamento, proximaAbertura } from '@/lib/flores-horario';

const COR_PRIMARIA = '#DC2626';
const COR_SOFT = '#FEE2E2';
const COR_DEEP = '#991B1B';
const GREEN = '#059669';

type ViaCepResp = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export default function CepEntrega() {
  const [cep, setCep] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [endereco, setEndereco] = useState<ViaCepResp | null>(null);
  const [erro, setErro] = useState('');
  const [modoEntrega, setModoEntrega] = useState<'rapida' | 'agendada'>('rapida');
  const [horarioAgendado, setHorarioAgendado] = useState('');
  const [aberto, setAberto] = useState(false);
  const [janela, setJanela] = useState<{ texto: string; disponivel: boolean }>({ texto: '', disponivel: false });
  const [horarios, setHorarios] = useState<string[]>([]);

  useEffect(() => {
    setAberto(estaAberto());
    setJanela(janelaEntregaAte1h());
    setHorarios(horariosAgendamento());
    // Se fechado, ja vai pra agendamento
    if (!estaAberto()) setModoEntrega('agendada');
  }, []);

  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const consultarCep = async (cepMasked: string) => {
    const cepLimpo = cepMasked.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    setBuscando(true);
    setErro('');
    setEndereco(null);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: ViaCepResp = await resp.json();
      if (data.erro) {
        setErro('CEP não encontrado');
      } else {
        setEndereco(data);
        try { localStorage.setItem('flores_cep', JSON.stringify({ cep: cepMasked, ...data })); } catch {}
      }
    } catch (e) {
      setErro('Erro ao consultar CEP');
    }
    setBuscando(false);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto 24px', padding: '22px', background: '#FFF', border: `1px solid #F0DDDD`, borderRadius: 14, boxShadow: '0 8px 24px -12px rgba(220,38,38,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: COR_PRIMARIA, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1a0f0f', letterSpacing: '-0.01em' }}>Calcular tempo para entrega</div>
            <div style={{ fontSize: 12, color: '#666' }}>Digite seu CEP para ver disponibilidade</div>
          </div>
        </div>
        <div style={{
          padding: '5px 10px',
          background: aberto ? `${GREEN}15` : '#FEF3C7',
          color: aberto ? GREEN : '#B45309',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          letterSpacing: '0.02em'
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: aberto ? GREEN : '#B45309' }} />
          {aberto ? 'ABERTO AGORA' : `FECHADO · ABRE ${proximaAbertura()}`}
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <MapPin size={16} color="#999" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="tel"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => {
            const v = formatarCep(e.target.value);
            setCep(v);
            setEndereco(null);
            setErro('');
            if (v.replace(/\D/g, '').length === 8) consultarCep(v);
          }}
          style={{ width: '100%', padding: '13px 14px 13px 38px', border: '1.5px solid #E5E5E5', borderRadius: 10, fontSize: 15, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
        />
        {buscando && <Loader2 size={16} color={COR_PRIMARIA} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite' }} />}
      </div>

      {erro && (
        <div style={{ padding: 10, background: '#FEF2F2', color: COR_PRIMARIA, borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={14} /> {erro}
        </div>
      )}

      {endereco && !erro && (
        <>
          <div style={{ padding: 14, background: '#FAFAF7', border: '1px solid #F0EDE8', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#8a6a6a', fontWeight: 700, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={12} color={GREEN} />
              Entregamos aqui
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Bairro</span>
                <span style={{ fontSize: 13, color: '#1a0f0f', fontWeight: 700, textAlign: 'right' }}>
                  {endereco.bairro || '—'}{endereco.localidade ? `, ${endereco.localidade}/${endereco.uf}` : ''}
                </span>
              </div>
              <div style={{ height: 1, background: '#F0EDE8' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Tempo</span>
                <span style={{ fontSize: 13, fontWeight: 800, textAlign: 'right', color: aberto ? GREEN : '#B45309' }}>
                  {aberto ? '45 a 90 minutos após a compra' : 'Entrega agendada'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setModoEntrega('rapida')}
              disabled={!aberto}
              style={{
                flex: 1,
                padding: '11px 12px',
                background: modoEntrega === 'rapida' ? COR_PRIMARIA : '#FFF',
                color: modoEntrega === 'rapida' ? '#FFF' : (aberto ? '#555' : '#BBB'),
                border: `1.5px solid ${modoEntrega === 'rapida' ? COR_PRIMARIA : '#E5E5E5'}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: aberto ? 'pointer' : 'not-allowed',
                opacity: !aberto ? 0.5 : 1,
              }}
            >
              <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
              Entrega em até 1h
            </button>
            <button
              onClick={() => setModoEntrega('agendada')}
              style={{
                flex: 1,
                padding: '11px 12px',
                background: modoEntrega === 'agendada' ? COR_PRIMARIA : '#FFF',
                color: modoEntrega === 'agendada' ? '#FFF' : '#555',
                border: `1.5px solid ${modoEntrega === 'agendada' ? COR_PRIMARIA : '#E5E5E5'}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
              Hora marcada
            </button>
          </div>

          {modoEntrega === 'rapida' && aberto && (
            <div style={{ padding: 14, background: `${GREEN}0d`, border: `1px solid ${GREEN}30`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, background: GREEN, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={20} color="#FFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 2, letterSpacing: '0.02em' }}>Previsão de entrega</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: GREEN, letterSpacing: '-0.01em' }}>
                    45 a 90 minutos
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
                    Após a compra · <b>Entrega grátis</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modoEntrega === 'agendada' && (
            <div style={{ padding: 14, background: '#FAFAF7', border: '1px solid #F0EDE8', borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: '#8a6a6a', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Escolha o horário</div>
              <select
                value={horarioAgendado}
                onChange={(e) => {
                  setHorarioAgendado(e.target.value);
                  try { localStorage.setItem('flores_horario', e.target.value); } catch {}
                }}
                style={{ width: '100%', padding: '11px 12px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 14, background: '#FFF', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="">Selecione o horário</option>
                {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              {horarioAgendado && (
                <div style={{ marginTop: 10, padding: 10, background: '#FFF', borderRadius: 8, fontSize: 13, color: '#333', border: `1px solid ${GREEN}30` }}>
                  <CheckCircle2 size={14} color={GREEN} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
                  Entrega agendada para <b>{horarioAgendado}</b> · Frete grátis
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 11, color: '#8a6a6a' }}>
                Funcionamento: das 06:30 às 22:30, todos os dias
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
