export type Produto = {
  slug: string;
  nome: string;
  preco: number;
  categoria: 'buques' | 'cestas' | 'combos' | 'presentes';
  imagem: string;
  descricao?: string;
};

// URLs de imagens do site original (funcionam como CDN externa)
const IMG_BASE = 'https://floriculturarosas.site/__l5e/assets-v1';

export const PRODUTOS: Produto[] = [
  { slug: 'buque-tradicional-de-12-rosas-coloridas', nome: 'Buquê Tradicional De 12 Rosas Coloridas', preco: 60, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/0ebad168-5fbd-49a4-a7b7-38ffdd16632b/buque-tradicional-de-12-rosas-coloridas-0-detail.webp' },
  { slug: 'buque-de-flores-em-tons-rosados', nome: 'Buquê De Flores Em Tons Rosados', preco: 60, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/1ce64dfc-2e3a-4d3a-91b1-0f0e96daa8a2/buque-de-flores-em-tons-rosados-0-detail.webp' },
  { slug: 'buque-com-06-rosas', nome: 'Buquê Com 06 Rosas', preco: 70, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/ff77b6a2-a058-4f15-bf64-840dca67113d/buque-com-06-rosas-0-detail.webp' },
  { slug: 'buque-7-rosas-com-10-bombons', nome: 'Buquê 7 Rosas com 10 bombons', preco: 110, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/883dae52-b2e1-41db-b1fa-35388a41187b/buque-7-rosas-com-10-bombons-0-detail.webp' },
  { slug: '3-rosas-com-ferrero-rocher-e-pelucia', nome: '3 Rosas Com Ferrero Rocher E Pelúcia', preco: 90, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/78eaf37d-aedb-4afb-a057-ed14e97ee8a0/3-rosas-com-ferrero-rocher-e-pelucia-0-detail.webp' },
  { slug: 'buque-pequeno-de-gerbera', nome: 'Buquê Pequeno De Gérbera', preco: 30, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/bc31fb29-f0ab-4535-8582-be9155ff647a/buque-pequeno-de-gerbera-0-detail.webp' },
  { slug: 'buque-tradicional-de-girassois', nome: 'Buquê Tradicional De Girassóis', preco: 80, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/7ed98b44-282a-4fcc-97a1-acf34ef3bb78/buque-tradicional-de-girassois-0-detail.webp' },
  { slug: 'buque-com-03-rosas', nome: 'Buquê Com 03 Rosas', preco: 50, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/e79566cc-9c9e-4c6b-9b64-0c7d25a844ff/buque-com-03-rosas-0-detail.webp' },
  { slug: 'buque-com-24-rosas-vermelhas', nome: 'Buquê Com 24 Rosas Vermelhas', preco: 150, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/2d04e6ca-b698-48cf-9834-caf32627a1a3/buque-com-24-rosas-vermelhas-0-detail.webp' },
  { slug: '6-rosas-com-ferrero-rocher', nome: '6 Rosas Com Ferrero Rocher', preco: 80, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/ee74ceb3-1819-47e3-b6c9-5bcc12aadbe1/6-rosas-com-ferrero-rocher-0-detail.webp' },
  { slug: 'mini-buque-de-girassol', nome: 'Mini Buquê De Girassol', preco: 40, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/5f8ec140-37bc-4018-a77e-ff4af7aeb2d7/mini-buque-de-girassol-0-detail.webp' },
  { slug: 'cesta-sonho-dos-chocolatras', nome: 'Cesta Sonho dos Chocólatras', preco: 110, categoria: 'cestas', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/1987ce64-bc7a-4b7c-8fe4-29326feb8783/cesta-sonho-dos-chocolatras-0-detail.webp' },
  { slug: 'buque-de-12-rosas-coloridas', nome: 'Buquê de 12 Rosas Coloridas', preco: 100, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/ae77a66c-e368-474a-b49d-564763a12e56/buque-de-12-rosas-coloridas-0-detail.webp' },
  { slug: 'florescer-natural', nome: 'Florescer Natural', preco: 50, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/1029911b-64da-4805-880a-a978bb725c13/florescer-natural-0-detail.webp' },
  { slug: '3-rosas-com-ferrero-rocher', nome: '3 Rosas Com Ferrero Rocher', preco: 60, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/e0180c08-9937-4c79-ac9a-01210392b214/3-rosas-com-ferrero-rocher-0-detail.webp' },
  { slug: 'cesta-de-cafe-gostosuras-da-manha', nome: 'Cesta de Café Gostosuras da Manhã', preco: 150, categoria: 'cestas', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/637b08f5-bd62-4430-b38a-30b0f6fd8f1a/cesta-de-cafe-gostosuras-da-manha-0-detail.webp' },
  { slug: 'buque-3-rosas-azuis-linha-premium', nome: 'Buquê 3 Rosas Azuis - Linha Premium', preco: 70, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/24f9f612-fca8-4bbe-b21d-94e524aecc99/buque-3-rosas-azuis-linha-premium-0-detail.webp' },
  { slug: 'caixa-artesanal-de-bombons-delicias-de-amor-153g', nome: 'Caixa Artesanal de Bombons Delícias de Amor 153g', preco: 50, categoria: 'presentes', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/e22aec8e-c25c-47df-b4f3-17175898b37d/caixa-artesanal-de-bombons-delicias-de-amor-153g-0-detail.webp' },
  { slug: '3-rosas-com-pelucia', nome: '3 Rosas Com Pelúcia', preco: 70, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/a9693432-196b-48be-a126-54a8bb704952/3-rosas-com-pelucia-0-detail.webp' },
  { slug: '12-rosas-com-ferrero-rocher-e-pelucia', nome: '12 Rosas Com Ferrero Rocher E Pelúcia', preco: 160, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/465b3fbf-7c42-4e32-b704-6dcef0b7ac31/12-rosas-com-ferrero-rocher-e-pelucia-0-detail.webp' },
  { slug: 'buque-de-5-girassois', nome: 'Buquê De 5 Girassóis', preco: 70, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/59cdd836-f46b-4083-b943-257ac9e02c93/buque-de-5-girassois-0-detail.webp' },
  { slug: 'buque-amore', nome: 'Buquê Amore', preco: 90, categoria: 'buques', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/9ce8bef7-ff55-46e4-9c92-876c9177be98/buque-amore-0-detail.webp' },
  { slug: '6-rosas-com-ferrero-rocher-e-pelucia', nome: '6 Rosas Com Ferrero Rocher E Pelúcia', preco: 150, categoria: 'combos', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/1aa54777-1ca0-4485-9626-ebc807b79f17/6-rosas-com-ferrero-rocher-e-pelucia-0-detail.webp' },
  { slug: 'orquidea-duas-hastes-branca-no-cachepo', nome: 'Orquídea Duas Hastes Branca No Cachepô', preco: 80, categoria: 'presentes', imagem: 'https://floriculturarosas.site/__l5e/assets-v1/d529cc69-6b2d-4074-a5df-2b81513c0a9e/orquidea-duas-hastes-branca-no-cachepo-0-detail.webp' },
];

export const CATEGORIAS = {
  buques: 'Buquês',
  cestas: 'Cestas',
  combos: 'Combos',
  presentes: 'Presentes',
};

export const WHATSAPP = '5511999999999'; // Trocar pelo real depois
export const NOME_LOJA = 'Rosa Maria';
export const TAGLINE = 'Atelier Botânico e Floricultura';
export const COR_PRIMARIA = '#DC2626'; // Vermelho vibrante
export const COR_SOFT = '#FEE2E2';
export const COR_DEEP = '#991B1B';

// Desconto ao pagar via PIX (13% off no total)
export const DESCONTO_PIX = 0.13;

// Helper: calcula preco com desconto PIX (arredondado pra inteiro)
export function precoComPix(preco: number): number {
  return Math.round(preco * (1 - DESCONTO_PIX));
}
