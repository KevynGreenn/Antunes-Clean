//teste
const allProducts = [
    {
        id: 1,
        name: 'CERA GOLD 5LT',
        price: 171.90,
        image: 'imagens/ceragold5lt.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: 'new',
        description: 'Cera Impermeabilizante Gold de alta performance, ideal para a proteção e brilho de pisos laváveis.'
    },
    {
        id: 2,
        name: 'GOTA MAX (LIMPA MANCHA)',
        price: 35.20,
        image: 'imagens/GOTA MAX(LIMPA MANCHA)5lt.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: 'new',
        description: 'Alvejante Gota Max sem cloro, ideal para limpeza de roupas brancas e coloridas, sem danificar o tecido.'
    },
    {
        id: 3,
        name: 'AMACIANTE 5LTS',
        price: 24.90,
        image: 'imagens/amaciante5lts.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Amaciante concentrado para deixar as roupas macias e perfumadas.'
    },
    {
        id: 4,
        name: 'DESINFETANTE BIO SANI 5LTS',
        price: 21.50,
        image: 'imagens/DESINFETANTE5 LTS/floral.webp',
        gallery: [
            'imagens/DESINFETANTE5 LTS/floral.webp',
            'imagens/DESINFETANTE5 LTS/laranja.webp',
            'imagens/DESINFETANTE5 LTS/magenta.webp',
            'imagens/DESINFETANTE5 LTS/roxo.webp',
            'imagens/DESINFETANTE5 LTS/talco.webp',
            'imagens/DESINFETANTE5 LTS/verde.webp'
        ],
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Desinfetante para uso geral com múltiplas fragrâncias. Limpa, desinfeta e perfuma o ambiente. Escolha sua fragrância favorita!'
    },
    {
        id: 5,
        name: 'MULTI-USO IZY-K 5LTS',
        price: 25.90,
        image: 'imagens/MULTI-USOIZY-K5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Limpador multi-uso com fragrância de Limão Casca. Ideal para limpeza de diversas superfícies laváveis.'
    },
    {
        id: 6,
        name: 'LAVA ROUPAS 5LTS',
        price: 39.90,
        image: 'imagens/LAVAROUPAS5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Detergente para lavagem de roupas em geral. Limpeza eficaz para suas roupas.'
    },
    {
        id: 7,
        name: 'LIMPA VIDROS 5LTS',
        price: 29.90,
        image: 'imagens/LIMPAVIDROS5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Limpa vidros com brilho para limpeza de vidros, acrílicos e espelhos. Remove manchas e sujeiras.'
    },
    {
        id: 8,
        name: 'AGUA SANITARIA 5 LTS',
        price: 14.20,
        image: 'imagens/AGUASANITARIA5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Água sanitária para limpeza e desinfecção de superfícies e alvejamento de roupas brancas.'
    },
    {
        id: 9,
        name: 'DETERGENTE NEUTRO TRADICIONAL 5L',
        price: 24.60,
        image: 'imagens/DETERGENTENEUTROTRADICIONAL5LPU.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Detergente neutro concentrado para lavagem de louças e limpeza em geral. Alto poder desengordurante.'
    },
    {
        id: 10,
        name: 'EVEN STAND - SABONETE LIQUIDO 5LTS',
        price: 29.90,
        image: 'imagens/EVENSTAND-SABONETELIQUIDO5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Sabão líquido suave e especial com fragrância de Cereja. Ideal para a limpeza delicada das mãos.'
    },
    {
        id: 11,
        name: 'SPLENDY 120 DESENGRAXANTE',
        price: 75.00,
        image: 'imagens/SPLENDY285CLSE.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Detergente desengraxante isento de soda cáustica, para limpeza pesada de superfícies e peças.'
    },
    {
        id: 12,
        name: 'ODORIZADORES 5LTS',
        price: 35.21,
        image: 'imagens/ODORIZADORES 5LTS.webp',
        category: 'produtos-de-limpeza',
        brand: 'Mirelle',
        tag: null,
        description: 'Limpador de uso geral com álcool perfumado, fragrância Bamboo. Deixa o ambiente limpo e cheiroso.'
    },
    {
        id: 13,
        name: 'Sacos para lixo Preto 200Lts',
        price: 135.00,
        image: 'imagens/sacodelixo.webp',
        category: 'sacos-de-lixo',
        brand: 'Antunes Clean',
        tag: null,
        description: 'Pacote de sacos de lixo reforçados com capacidade para 200 litros.'
    },
    {
        id: 14,
        name: 'Sacos para lixo Preto 100Lts',
        price: 65.00,
        image: 'imagens/sacodelixo.webp',
        category: 'sacos-de-lixo',
        brand: 'Antunes Clean',
        tag: null,
        description: 'Pacote de sacos de lixo reforçados com capacidade para 100 litros.'
    },
    {
        id: 15,
        name: 'Sacos para lixo Preto 60Lts',
        price: 40.00,
        image: 'imagens/sacodelixo.webp',
        category: 'sacos-de-lixo',
        brand: 'Antunes Clean',
        tag: null,
        description: 'Pacote de sacos de lixo reforçados com capacidade para 60 litros.'
    },
    {
        id: 16,
        name: 'Sacos para lixo Preto 40Lts',
        price: 30.00,
        image: 'imagens/sacodelixo.webp',
        category: 'sacos-de-lixo',
        brand: 'Antunes Clean',
        tag: null,
        description: 'Pacote de sacos de lixo reforçados com capacidade para 40 litros.'
    },
    {
        id: 17,
        name: 'Sacos para lixo Preto 20Lts',
        price: 20.00,
        image: 'imagens/sacodelixo.webp',
        category: 'sacos-de-lixo',
        brand: 'Antunes Clean',
        tag: null,
        description: 'Pacote de sacos de lixo reforçados com capacidade para 20 litros.'
    },
    {
        id: 18,
        name: 'COPO DESC 180 ML TRANS',
        price: 134.80,
        image: 'imagens/copodescartavel.webp',
        category: 'Papeis, Panos, Copo e Esponja',
        brand: 'Antunes Clean',
        tag: null,
        description: 'COPO DESC 180 ML TRANS C/2500 PP'
    },
    {
        id: 19,
        name: 'PAPEL HIG. ROLAO BRANCO',
        price: 59.00,
        image: 'imagens/papelrolao.webp',
        category: 'Papeis, Panos, Copo e Esponja',
        brand: 'Antunes Clean',
        tag: null,
        description: 'PAPEL HIG. ROLAO BRANCO 220Mts'
    },
    

];