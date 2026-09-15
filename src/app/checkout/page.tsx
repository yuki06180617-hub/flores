'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Send } from 'lucide-react';
import { NOME_LOJA, COR_PRIMARIA, COR_SOFT, COR_DEEP, WHATSAPP } from '@/lib/flores-produtos';
import LogoRosas from '@/components/LogoRosas';

type Item = { slug: string; nome: string; preco: number; qtd: number };

export default function Checkout() {
  const [itens, setItens] = useState<Item[]>([]);
  const [dados, setDados] = useState({ nome: '', telefone: '', cep: '', endereco: '', complemento: '', destinatario: '', mensagem: '' });
  const [erro, setErro] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flores_carrinho');
      setItens(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  const formatarTel = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  const formatarCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const enviarWhatsapp = () => {
    setErro('');
    if (!dados.nome || !dados.telefone || !dados.cep || !dados.endereco) {
      setErro('Preencha nome, telefone, CEP e endereço');
      return;
    }
    if (itens.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    const linhas = [
      `*Novo Pedido - ${NOME_LOJA}*`,
      '',
      `*Cliente:* ${dados.nome}`,
      `*Telefone:* ${dados.telefone}`,
      `*CEP:* ${dados.cep}`,
      `*Endereço:* ${dados.endereco}`,
      dados.complemento ? `*Complemento:* ${dados.complemento}` : '',
      dados.destinatario ? `*Para:* ${dados.destinatario}` : '',
      dados.mensagem ? `*Mensagem no cartão:* ${dados.mensagem}` : '',
      '',
      '*Itens do pedido:*',
      ...itens.map(i => `• ${i.qtd}x ${i.nome} - R$ ${i.preco * i.qtd},00`),
      '',
      `*Total: R$ ${total},00*`,
      '*Frete: Grátis*',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas)}`;
    window.open(url, '_blank');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#FFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      <div style={{ background: COR_DEEP, color: '#FFF', padding: '8px 20px', fontSize: 12, textAlign: 'center' }}>Entrega Grátis em 1 hora</div>

      <header style={{ background: '#FFF', borderBottom: '1px solid #F1E4E4', padding: '16px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoRosas height={44} mostrarTagline={false} />
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        <Link href="/carrinho" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar ao carrinho
        </Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Finalizar Pedido</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Form */}
          <div style={{ background: '#FFF', border: '1px solid #F1E4E4', borderRadius: 12, padding: 20 }}>
            {[
              { key: 'nome', label: 'Seu nome completo', placeholder: 'Como aparece no comprovante' },
              { key: 'telefone', label: 'Telefone WhatsApp', placeholder: '(11) 99999-9999', mask: formatarTel },
              { key: 'cep', label: 'CEP de entrega', placeholder: '00000-000', mask: formatarCep },
              { key: 'endereco', label: 'Endereço completo', placeholder: 'Rua, número, bairro, cidade' },
              { key: 'complemento', label: 'Complemento (opcional)', placeholder: 'Apto, bloco, referência' },
              { key: 'destinatario', label: 'Nome do destinatário (opcional)', placeholder: 'Se for presente' },
              { key: 'mensagem', label: 'Mensagem no cartão (opcional)', placeholder: 'O que quer escrever?', textarea: true },
            ].map((f: any) => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>{f.label}</label>
                {f.textarea ? (
                  <textarea rows={3} value={(dados as any)[f.key]} onChange={(e) => setDados({ ...dados, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 14, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                ) : (
                  <input type="text" value={(dados as any)[f.key]} onChange={(e) => setDados({ ...dados, [f.key]: f.mask ? f.mask(e.target.value) : e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                )}
              </div>
            ))}

            {erro && <div style={{ color: COR_PRIMARIA, fontSize: 13, marginBottom: 12 }}>{erro}</div>}
          </div>

          {/* Resumo */}
          <div>
            <div style={{ background: COR_SOFT, borderRadius: 12, padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Resumo do Pedido</div>

              {itens.map((item) => (
                <div key={item.slug} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#555' }}>{item.qtd}x {item.nome}</span>
                  <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>R$ {item.preco * item.qtd}</span>
                </div>
              ))}

              <div style={{ height: 1, background: '#F1E4E4', margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: '#555' }}>
                <span>Subtotal</span><span>R$ {total},00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#059669', fontWeight: 700 }}>
                <span>Frete</span><span>Grátis</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: COR_PRIMARIA }}>
                <span>Total</span><span>R$ {total},00</span>
              </div>

              <button onClick={enviarWhatsapp} style={{ width: '100%', marginTop: 20, padding: '14px', background: '#25D366', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Send size={16} /> Finalizar via WhatsApp
              </button>

              <div style={{ marginTop: 12, fontSize: 11, color: '#666', textAlign: 'center' }}>
                Você será redirecionado para o WhatsApp com o resumo do pedido. PIX em breve.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
