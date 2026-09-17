export type Cesta = {
  slug: string;
  nome: string;
  preco: number;
  imagem: string;
  descricao?: string;
};

export const CESTAS: Cesta[] = [
  { slug: 'cesta-de-cafe-da-manha-com-carinho', nome: 'Cesta de café da manhã - Com carinho', preco: 158, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/4-19.png' },
  { slug: 'cesta-de-cafe-da-manha-premium', nome: 'Cesta de café da manhã premium', preco: 280, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/19-65.png' },
  { slug: 'cesta-de-cafe-da-manha-luxo-para-dois', nome: 'Cesta de Café da Manhã Luxo Para Dois', preco: 297, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/17-63.png' },
  { slug: 'mimo-de-cesta-de-cafe-da-manha-belissima', nome: 'Mimo de Cesta de Café da Manhã Belíssima', preco: 155, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/9-24.png' },
  { slug: 'mimo-cesta-de-cafe-da-manha', nome: 'Mimo - cesta de café da manhã', preco: 166, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/16-62.png' },
  { slug: 'cesta-de-cafe-da-manha-tarde-dia-belo', nome: 'CESTA DE CAFÉ DA MANHÃ/TARDE - DIA BELO', preco: 225, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/232-107.png' },
  { slug: 'cesta-especial-metade-cafe-metade-chocolate', nome: 'Cesta Especial - Metade Café / Metade Chocolate', preco: 220, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/5-17.png' },
  { slug: 'cesta-de-cafe-da-manha-com-chocolate-happy-day', nome: 'Mimo de café da manhã/chocolate - happy day', preco: 154, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/34-82.png' },
  { slug: 'cesta-de-cafe-da-manha-encanto', nome: 'Cesta de café da manhã encanto', preco: 170, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/35-83.png' },
  { slug: 'cesta-de-cafe-da-manha-para-duas-pessoas', nome: 'Cesta de café da manhã - Serve até duas pessoas', preco: 260, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/38-86.png' },
  { slug: 'cesta-de-cafe-da-manha-admiro-voce', nome: 'Cesta de café da manhã - Admiro Você', preco: 239, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/37-85.png' },
  { slug: 'cesta-de-cafe-da-manha-dia-feliz', nome: 'Cesta De Café Da Manhã Dia Feliz', preco: 228, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/36-84.png' },
  { slug: 'cesta-de-cafe-da-manha-com-ursinho-caneca', nome: 'Cesta de café da manhã com ursinho+caneca', preco: 190, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/239-114.png' },
  { slug: 'cesta-de-cafe-da-manha-mais-que-demais', nome: 'Cesta De Café Da Manhã Mais Que Demais', preco: 200, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/240-115.png' },
  { slug: 'cesta-cafe-da-manha-tudo-de-bom', nome: 'Cesta café da manhã Tudo de Bom', preco: 220, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/241-116.png' },
  { slug: 'cesta-de-cafe-da-manha-happy-birthday', nome: 'Cesta de café da manhã - happy birthday', preco: 189, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/242-117.png' },
  { slug: 'cesta-de-cafe-da-manha-em-sao-paulo', nome: 'Cesta de café da manhã / café da tarde - Delícias ao amanhecer', preco: 209, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/243-118.png' },
  { slug: 'cesta-de-aniversario-curta-seu-dia', nome: 'CESTA DE ANIVERSÁRIO CURTA SEU DIA', preco: 205, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/260-138.png' },
  { slug: 'cesta-de-cafe-da-manha-energia-para-o-seu-dia', nome: 'CESTA DE CAFÉ DA MANHÃ ENERGIA PARA O SEU DIA', preco: 240, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/263-141.png' },
  { slug: 'cesta-de-cafe-da-manha-panda', nome: 'Cesta de café da manhã - Panda', preco: 218, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/264-142.png' },
  { slug: 'cesta-de-cafe-da-manha-encanto-luxuoso', nome: 'Cesta de café da manhã encanto luxuoso', preco: 255, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/265-143.png' },
  { slug: 'cesta-de-cafe-da-manha-com-ferrero', nome: 'Cesta de Café da Manhã Com Ferrero', preco: 226, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/266-144.png' },
  { slug: 'cesta-de-cafe-da-manha-amor-que-contagia', nome: 'CESTA DE CAFÉ DA MANHÃ AMOR QUE CONTAGIA', preco: 224, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/267-145.png' },
  { slug: 'cesta-de-cafe-da-manha-pura-harmonia', nome: 'Cesta de café da manhã - Pura harmonia', preco: 209, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/304-185.png' },
  { slug: 'mimo-de-cafe-da-manha-comecar-bem', nome: 'Mimo de Café da Manhã - Começar Bem', preco: 172, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/321-204.png' },
  { slug: 'cesta-de-cafe-da-manha-afeto-em-sabores', nome: 'Cesta de Café da Manhã - Afeto em Sabores', preco: 250, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/323-206.png' },
  { slug: 'cesta-de-cafe-da-manha-amanhecer-com-carinho', nome: 'Cesta de café da manhã amanhecer com carinho', preco: 177, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/332-215.png' },
  { slug: 'cesta-de-cafe-da-manha-manha-especial', nome: 'CESTA DE CAFÉ DA MANHÃ - MANHÃ ESPECIAL', preco: 216, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/335-218.png' },
  { slug: 'cesta-de-cafe-da-manha-com-carinho-no-vermelho', nome: 'Cesta De Café Da Manhã Com Carinho No Vermelho', preco: 236, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/338-221.png' },
  { slug: 'cesta-de-cafe-da-manha-cafe-do-amor', nome: 'Cesta De Café Da Manhã Café Do Amor', preco: 230, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/339-222.png' },
  { slug: 'cesta-cafe-da-manha-paraiso-de-cesta', nome: 'Cesta café da manhã paraíso de cesta', preco: 200, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/344-227.png' },
  { slug: 'cesta-de-cafe-da-manha-belissima-manha', nome: 'Cesta De Café Da Manhã Belissima Manhã', preco: 213, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/345-228.png' },
  { slug: 'cesta-de-cafe-da-manha-serve-ate-4-pessoas', nome: 'Cesta de café da manhã-Serve até 4 pessoas', preco: 256, imagem: 'https://cestasepresentesmila.com.br/admin2/public/assets/images/products/351-234.png' },
];
