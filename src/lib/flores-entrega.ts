// Gera slots de 1h dentro do horario 06:30 - 22:30
// Para hoje + proximos 3 dias

const ABERTURA_H = 6;
const ABERTURA_M = 30;
const FECHAMENTO_H = 22;
const FECHAMENTO_M = 30;

export type Slot = { value: string; label: string };
export type DiaSlots = { data: string; label: string; slots: Slot[] };

function fmtHora(h: number, m: number): string {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function slotsDoDia(base: Date, incluirPassados: boolean = false): Slot[] {
  const slots: Slot[] = [];
  const agora = new Date();
  // Comeca em 06:30
  let hAtual = ABERTURA_H;
  let mAtual = ABERTURA_M;
  while (hAtual < FECHAMENTO_H || (hAtual === FECHAMENTO_H && mAtual < FECHAMENTO_M)) {
    let hFim = hAtual + 1;
    let mFim = mAtual;
    if (hFim > FECHAMENTO_H || (hFim === FECHAMENTO_H && mFim > FECHAMENTO_M)) {
      hFim = FECHAMENTO_H;
      mFim = FECHAMENTO_M;
    }
    // Se e hoje, so mostra slots futuros (pelo menos 2h depois do agora)
    if (!incluirPassados) {
      const slotInicio = new Date(base);
      slotInicio.setHours(hAtual, mAtual, 0, 0);
      const limiar = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
      if (slotInicio < limiar) {
        hAtual = hFim;
        mAtual = mFim;
        continue;
      }
    }
    const inicio = fmtHora(hAtual, mAtual);
    const fim = fmtHora(hFim, mFim);
    slots.push({ value: `${inicio}-${fim}`, label: `${inicio} às ${fim}` });
    hAtual = hFim;
    mAtual = mFim;
  }
  return slots;
}

export function proximosDiasComSlots(): DiaSlots[] {
  const dias: DiaSlots[] = [];
  const agora = new Date();
  for (let i = 0; i < 4; i++) {
    const d = new Date(agora);
    d.setDate(d.getDate() + i);
    const dataStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    let label = '';
    if (i === 0) label = 'Hoje';
    else if (i === 1) label = 'Amanhã';
    else label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' });
    const slots = slotsDoDia(d, i > 0);
    if (slots.length > 0) dias.push({ data: dataStr, label, slots });
  }
  return dias;
}
