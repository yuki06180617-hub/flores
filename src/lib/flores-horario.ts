// Horario de funcionamento: 06:30 as 22:30 (todos os dias)
export const ABERTURA_H = 6;
export const ABERTURA_M = 30;
export const FECHAMENTO_H = 22;
export const FECHAMENTO_M = 30;

export function estaAberto(): boolean {
  const agora = new Date();
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const minutosAbertura = ABERTURA_H * 60 + ABERTURA_M;
  const minutosFechamento = FECHAMENTO_H * 60 + FECHAMENTO_M;
  return minutosAgora >= minutosAbertura && minutosAgora < minutosFechamento;
}

export function proximaAbertura(): string {
  const agora = new Date();
  const proxima = new Date(agora);
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const minutosAbertura = ABERTURA_H * 60 + ABERTURA_M;
  if (minutosAgora >= minutosAbertura && minutosAgora < FECHAMENTO_H * 60 + FECHAMENTO_M) {
    return 'agora';
  }
  if (minutosAgora >= FECHAMENTO_H * 60 + FECHAMENTO_M) {
    proxima.setDate(proxima.getDate() + 1);
  }
  proxima.setHours(ABERTURA_H, ABERTURA_M, 0, 0);
  return `${proxima.getHours().toString().padStart(2, '0')}:${proxima.getMinutes().toString().padStart(2, '0')}`;
}

export function janelaEntregaAte1h(): { texto: string; disponivel: boolean } {
  if (!estaAberto()) {
    return { texto: `Fechado agora · Abrimos ${proximaAbertura()}`, disponivel: false };
  }
  const agora = new Date();
  const fim = new Date(agora.getTime() + 60 * 60 * 1000);
  const fechamento = new Date();
  fechamento.setHours(FECHAMENTO_H, FECHAMENTO_M, 0, 0);
  const fimReal = fim.getTime() > fechamento.getTime() ? fechamento : fim;
  const fmt = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  return { texto: `Entrega até ${fmt(fimReal)}`, disponivel: true };
}

export function horariosAgendamento(): string[] {
  const agora = new Date();
  const opts: string[] = [];
  let cur = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
  const min = cur.getMinutes();
  if (min < 30) cur.setMinutes(30);
  else { cur.setHours(cur.getHours() + 1); cur.setMinutes(0); }
  cur.setSeconds(0);

  // Se agora ja passou do fechamento, comeca amanha na abertura
  const fechamentoHoje = new Date(agora);
  fechamentoHoje.setHours(FECHAMENTO_H, FECHAMENTO_M, 0, 0);
  if (cur.getTime() > fechamentoHoje.getTime()) {
    cur.setDate(cur.getDate() + 1);
    cur.setHours(ABERTURA_H, ABERTURA_M, 0, 0);
  }

  const limite = new Date(agora);
  limite.setDate(limite.getDate() + 2);
  limite.setHours(FECHAMENTO_H, FECHAMENTO_M, 0, 0);

  while (cur.getTime() <= limite.getTime() && opts.length < 30) {
    const h = cur.getHours();
    const m = cur.getMinutes();
    const minutosCur = h * 60 + m;
    const abertura = ABERTURA_H * 60 + ABERTURA_M;
    const fechamento = FECHAMENTO_H * 60 + FECHAMENTO_M;

    if (minutosCur >= abertura && minutosCur <= fechamento) {
      const isHoje = cur.toDateString() === agora.toDateString();
      const amanha = new Date(agora);
      amanha.setDate(amanha.getDate() + 1);
      const isAmanha = cur.toDateString() === amanha.toDateString();
      let dia = 'Hoje';
      if (isAmanha) dia = 'Amanhã';
      else if (!isHoje) dia = cur.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      opts.push(`${dia} · ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
    cur = new Date(cur.getTime() + 30 * 60000);

    // Pula pra proxima abertura se ja passou de 22:30
    if (cur.getHours() > FECHAMENTO_H || (cur.getHours() === FECHAMENTO_H && cur.getMinutes() > FECHAMENTO_M)) {
      cur.setDate(cur.getDate() + 1);
      cur.setHours(ABERTURA_H, ABERTURA_M, 0, 0);
    }
  }
  return opts;
}
