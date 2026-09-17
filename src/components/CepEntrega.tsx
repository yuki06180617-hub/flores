'use client';
import { useEffect, useState } from 'react';
import { MapPin, Loader2, CheckCircle2, AlertCircle, Truck, Calendar } from 'lucide-react';
import { COR_PRIMARIA, COR_SOFT, COR_DEEP } from '@/lib/flores-produtos';
import { proximosDiasComSlots } from '@/lib/flores-entrega';

const GREEN = '#059669';

export default function CepEntrega() {
  const [cep, setCep] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [encontrado, setEncontrado] = useState<any>(null);
  const [erro, setErro] = useState('');
  const [entregaTipo, setEntregaTipo] = useState<'expressa' | 'agendada' | null>(null);
  const [entregaData, setEntregaData] = useState('');
  const [entregaSlot, setEntregaSlot] = useState('');

  const diasSlots = proximosDiasComSlots();
  const slotsDoDia = diasSlots.find(d => d.data === entregaData)?.slots || [];

  // Carrega CEP e entrega salvos
  useEffect(() => {
    try {
      const salvo = localStorage.getItem('flores_cep');
      if (salvo) {
        const dados = JSON.parse(salvo);
        if (dados.cep) setCep(dados.cep);
        if (dados.logradouro) setEncontrado(dados);
        if (dados.entregaTipo) setEntregaTipo(dados.entregaTipo);
        if (dados.entregaData) setEntregaData(dados.entregaData);
        if (dados.entregaSlot) setEntregaSlot(dados.entregaSlot);
      }
    } catch {}
  }, []);

  const salvarEscolha = (extras: any = {}) => {
    try {
      const dados = {
        cep,
        logradouro: encontrado?.logradouro || '',
        bairro: encontrado?.bairro || '',
        localidade: encontrado?.localidade || '',
        uf: encontrado?.uf || '',
        entregaTipo,
        entregaData,
        entregaSlot,
        ...extras,
      };
      localStorage.setItem('flores_cep', JSON.stringify(dados));
    } catch {}
  };

  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const consultar = async (cepMasked: string) => {
    const l = cepMasked.replace(/\D/g, '');
    if (l.length !== 8) return;
    setBuscando(true);
    setErro('');
    setEncontrado(null);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${l}/json/`);
      const d = await r.json();
      if (d.erro) {
        setErro('CEP não encontrado.');
      } else {
        setEncontrado(d);
        salvarEscolha({
          cep: cepMasked,
          logradouro: d.logradouro,
          bairro: d.bairro,
          localidade: d.localidade,
          uf: d.uf,
        });
      }
    } catch {
      setErro('Erro ao consultar. Tente novamente.');
    }
    setBuscando(false);
  };

  useEffect(() => {
    if (entregaTipo || entregaData || entregaSlot) {
      salvarEscolha();
    }
    // eslint-disable-next-line
  }, [entregaTipo, entregaData, entregaSlot]);

  const inputStyle = { width: '100%', padding: '11px 13px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' as const, fontFamily: 'inherit', outline: 'none' };

  return (
    <div style={{ marginTop: 20, padding: 18, background: '#FAFAF7', borderRadius: 12, border: '1px solid #F0EDE8' }}>
      <div style={{ fontSize: 11, color: COR_DEEP, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MapPin size={12} color={COR_PRIMARIA} />
        Disponibilidade de entrega
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="tel"
          inputMode="numeric"
          value={cep}
          onChange={(e) => {
            const v = formatarCep(e.target.value);
            setCep(v);
            setEncontrado(null);
            setErro('');
            if (v.replace(/\D/g, '').length === 8) consultar(v);
          }}
          placeholder="Digite seu CEP"
          style={{ ...inputStyle, paddingRight: 40 }}
        />
        {buscando && <Loader2 size={16} color={COR_PRIMARIA} style={{ position: 'absolute', right: 12, top: 12, animation: 'spin 1s linear infinite' }} />}
      </div>

      {erro && (
        <div style={{ marginTop: 10, padding: 10, background: '#FEF2F2', color: COR_PRIMARIA, borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={12} /> {erro}
        </div>
      )}

      {encontrado && !erro && (
        <>
          <div style={{ marginTop: 12, padding: '10px 12px', background: '#FFF', border: '1px solid #F0EDE8', borderRadius: 8, fontSize: 12, color: '#333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <CheckCircle2 size={12} color={GREEN} />
              <span style={{ color: '#8a6a6a', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Entregamos aqui</span>
            </div>
            <div style={{ fontSize: 12, color: '#333', lineHeight: 1.4, fontWeight: 600 }}>
              {encontrado.logradouro && `${encontrado.logradouro}, `}{encontrado.bairro && `${encontrado.bairro} — `}{encontrado.localidade}/{encontrado.uf}
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, color: '#8a6a6a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Escolha o tempo</div>

          <div style={{ display: 'grid', gap: 8, marginBottom: entregaTipo === 'agendada' ? 12 : 0 }}>
            <div
              onClick={() => setEntregaTipo('expressa')}
              style={{ padding: 12, border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: entregaTipo === 'expressa' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${entregaTipo === 'expressa' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {entregaTipo === 'expressa' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: COR_PRIMARIA }} />}
              </div>
              <Truck size={16} color={GREEN} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a0f0f' }}>Entrega expressa</div>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginTop: 2 }}>45 a 90 minutos após a compra</div>
              </div>
            </div>

            <div
              onClick={() => setEntregaTipo('agendada')}
              style={{ padding: 12, border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#E5E5E5'}`, borderRadius: 10, background: entregaTipo === 'agendada' ? '#FFF8F8' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${entregaTipo === 'agendada' ? COR_PRIMARIA : '#CCC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {entregaTipo === 'agendada' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: COR_PRIMARIA }} />}
              </div>
              <Calendar size={16} color={COR_PRIMARIA} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a0f0f' }}>Agendar entrega</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Escolha data e horário</div>
              </div>
            </div>
          </div>

          {entregaTipo === 'agendada' && (
            <div style={{ background: '#FFF', border: '1px solid #F0EDE8', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Data</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {diasSlots.map((d) => (
                  <button
                    key={d.data}
                    onClick={() => { setEntregaData(d.data); setEntregaSlot(''); }}
                    style={{ padding: '6px 12px', border: `1.5px solid ${entregaData === d.data ? COR_PRIMARIA : '#E5E5E5'}`, background: entregaData === d.data ? COR_PRIMARIA : '#FFF', color: entregaData === d.data ? '#FFF' : '#555', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {entregaData && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#8a6a6a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Horário</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 6 }}>
                    {slotsDoDia.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setEntregaSlot(s.value)}
                        style={{ padding: '8px 6px', border: `1.5px solid ${entregaSlot === s.value ? COR_PRIMARIA : '#E5E5E5'}`, background: entregaSlot === s.value ? COR_PRIMARIA : '#FFF', color: entregaSlot === s.value ? '#FFF' : '#555', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {s.label}
                      </button>
                    ))}
                    {slotsDoDia.length === 0 && <div style={{ fontSize: 11, color: '#8a6a6a', gridColumn: '1/-1' }}>Sem horários.</div>}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
