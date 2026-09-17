export type Cesta = {
  slug: string;
  nome: string;
  preco: number;
  imagem: string;
  descricao?: string;
};

export const CESTAS: Cesta[] = [
  {
    slug: 'bambini',
    nome: 'Bambini · Cesta de café da manhã infantil · Congregare',
    preco: 200,
    imagem: 'https://static.wixstatic.com/media/c3a811_d00ea6fc341c4e11b785b4d99839c5f2~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Pra celebrar a alegria de ser criança!  O cuidado e a qualidade de todas as nossas cestas agora para os pequenos da sua vida! Nossa composição equilibra salgado e doce, mas caso prefira, fale conosco para personalizar com outra combinação para esta cesta de café da manhã infantil. 💫Torne seu presente ainda mais especial! Selecione AQUI os itens adicionais que deseja incluir.',
  },
  {
    slug: 'buongiorno-a-due-cesta-cafe-da-manha-casal',
    nome: 'Buongiorno a Due · Cesta de café da manhã para casal · Congregare',
    preco: 347,
    imagem: 'https://static.wixstatic.com/media/c3a811_6117a5fb6ad24f03b486c17efe0cc140~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Um café da manhã à dois! Perfeita para marcar manhãs especiais em casa, em um hotel ou para presentear aquele casal querido!  💫Torne seu presente ainda mais especial! Selecione AQUI os itens adicionais que deseja incluir. 🌱Vegetarianos e Veganos: fale com a gente que adaptamos a composição para te atender da melhor maneira!',
  },
  {
    slug: 'buongiorno-surpresa-cesta-de-cafe-da-manha-com-flor',
    nome: 'Cesta de Café da Manhã Com Flores · Congregare',
    preco: 286,
    imagem: 'https://static.wixstatic.com/media/c3a811_0179acb8718c436bbf5b3927a40b45aa~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Um café da manhã que é um presente! Delicada e surpreendente, o destaque é para o mini buquê de flores frescas que a acompanha, os doces artesanais e nosso exclusivo potinho caprese com pesto rústico de manjericão com nozes.',
  },
  {
    slug: 'cesta-brunch-congregare',
    nome: 'Cesta de brunch para café da manhã · Congregare',
    preco: 423,
    imagem: 'https://static.wixstatic.com/media/c3a811_a163173c28c549848be81a70c6381dd9~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Uma cesta de café da manhã com o charme do brunch!  A delicadeza do mini espumante para celebrar, acompanhado de um clássico croissant francês com os acompanhamentos perfeitos para este momento especial. O toque especial fica por conta do arranjo de flores frescas no vasinho.💫Torne seu presente ainda mais especial! Selecione os itens adicionais que deseja incluir. 🌱Vegetarianos e Veganos: fale...',
  },
  {
    slug: 'cesta-de-aniversario-auguri',
    nome: 'Cesta de Café da Manhã de Aniversário Auguri · Congregare',
    preco: 289,
    imagem: 'https://static.wixstatic.com/media/c3a811_cf37f773c144479998db3e127bd2a7f6~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Auguri. Parabéns em italiano! Essa é a nossa cesta clássica de café da manhã para aniversário. O mini cake é perfeito para começar o dia comemorando, mas você pode optar por macarons ou bolinho caseiro com o trio de brigadeiros. 💫Torne seu presente ainda mais especial! Selecione AQUI os itens adicionais que deseja incluir. 🌱Vegetarianos e Veganos: fale com a gente que adaptamos a composição para...',
  },
  {
    slug: 'cesta-de-cafe-da-manha-buongiorno',
    nome: 'Cesta de Café da Manhã Buongiorno · Congregare',
    preco: 265,
    imagem: 'https://static.wixstatic.com/media/c3a811_1e1e2406f18f4c0ebff9f325fc4af4ab~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'A Cesta de Café da Manhã Buongiorno da Congregare tem a composição perfeita para presentear! Ela atende até duas pessoas. Personalize com produtos extras e surpreenda!',
  },
  {
    slug: 'cesta-de-cafe-da-manha-buongiorno-speciale',
    nome: 'Buongiorno Speciale · Cesta de café da manhã · Congregare',
    preco: 472,
    imagem: 'https://static.wixstatic.com/media/c3a811_64c09498babd4fac9058592ed17569b6~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'A cesta de café da manhã Buongiorno Speciale é a melhor escolha para presentear e celebrar em família! Surpreenda com essa composição completa que atende até quatro pessoas.  💫Torne seu presente ainda mais especial! Selecione AQUI os itens adicionais que deseja incluir.🌱Vegetarianos e Veganos: fale com a gente que adaptamos a composição para te atender da melhor',
  },
  {
    slug: 'cesta-de-cafe-da-manha-de-aniversario',
    nome: 'Buon Compleanno · Cesta de café da manhã de aniversário',
    preco: 385,
    imagem: 'https://static.wixstatic.com/media/c3a811_ec452d0e4b4a4e25b6ab77afdbb7ccdb~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'A cesta de café da manhã perfeita para dar parabéns com muito carinho, elegância. Escolha o doce de sua preferência!Todos os itens vão dispostos em um lindo cesto de fibra natural ou caixotinho de madeira, decorado com guardanapo de algodão.  💫Torne seu presente ainda mais especial! Selecione AQUI os itens adicionais que deseja incluir. 🌱Vegetarianos e Veganos: fale com a gente que adaptamos a...',
  },
  {
    slug: 'mammamia',
    nome: 'Mamma Mia · Cesta Premium de Café da Manhã · Congregare',
    preco: 627,
    imagem: 'https://static.wixstatic.com/media/0d833e_444e6e315d5c46f7bd9b1d794c682c5f~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Uma cesta de café da manhã completa e cheia de charme para desfrutar com toda família,  agradecer uma pessoa importante em sua vida ou reunir a turma toda e dar um presentão pra uma pessoa querida! Você ainda pode dar um toque final ao seu presente com a nossa vela aromatizada artesanal em potinho estilo leiteira com tampa de cortiça. 🌱Vegetarianos e Veganos: fale com a gente que adaptamos a...',
  },
  {
    slug: 'petit-brunch-cesta-de-cafe-da-manha-com-flores',
    nome: 'Petit Brunch · Cesta de café da manhã com flores · Congregare',
    preco: 286,
    imagem: 'https://static.wixstatic.com/media/c3a811_98aedb15ba6048e59286166fe48e1236~mv2.jpeg/v1/fit/w_800,h_800,q_85/file.jpg',
    descricao: 'Uma combinação harmoniosa para um brunch delicioso! Esta opção de cesta de café da manhã com flores tem croissants macios, presunto cru fatiado e parfait de frutas. Finalize com um mini buquê à sua escolha: flores frescas ou um lindo arranjo artesanal de flores secas, que prolonga a lembrança do momento. Ideal para 1 pessoa. 💫Torne seu presente ainda mais especial! Selecione AQUI os itens...',
  },
];
