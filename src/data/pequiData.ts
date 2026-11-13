export interface PequiProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  weight: string;
  image: string;
  highlights: string[];
  description: string;
}

export interface BackgroundSlide {
  id: number;
  src: string;
  title: string;
  caption: string;
}

export const PRODUCTS: PequiProduct[] = [
  {
    id: 'pequi-comercial',
    name: 'Pequi Comercial',
    subtitle: 'Pacote 500g · Selecionado a Vácuo',
    price: 25,
    weight: 'Pacote 500g',
    image: '/assets/aistudio/image_ab1be65f.png',
    highlights: ['100% Natural', 'Rico em Nutrientes', 'Ideal para Receitas'],
    description:
      'O sabor autêntico do Cerrado na sua mesa. Frutos selecionados, macios e prontos para o preparo.',
  },
  {
    id: 'pequi-gigante',
    name: 'Pequi Gigante',
    subtitle: 'Pacote 500g · Frutos Graúdos e Carnudos',
    price: 35,
    weight: 'Pacote 500g',
    image: '/assets/aistudio/image_c2b77b74.png',
    highlights: ['Frutos Graúdos', 'Extra Carnudo', 'Super Docinho'],
    description:
      'Tradição do Cerrado com caroços gigantes, polpa espessa e sabor marcante que rende muito mais.',
  },
  {
    id: 'pequi-super-gigante',
    name: 'Pequi Super Gigante',
    subtitle: 'Pacote 1kg · Seleção Especial Ouro',
    price: 50,
    weight: 'Pacote 1kg',
    image: '/assets/aistudio/image_f4779695.png',
    highlights: ['Embalagem 1kg', 'Máxima Polpa', 'Qualidade Premium'],
    description:
      'Os maiores pequis do Cerrado em pacote de 1kg. Polpa abundante e maciez incomparável.',
  },
];

export const BACKGROUND_CAROUSEL_IMAGES: BackgroundSlide[] = [
  {
    id: 1,
    src: '/assets/aistudio/Generating_Brazilian_food_catalo__0baea5cb_ba1219ba.jpg',
    title: 'O Sabor do Cerrado na Sua Mesa',
    caption: 'Frango caipira dourado com Pequi Ouro do Cerrado.',
  },
  {
    id: 2,
    src: '/assets/aistudio/Generate_catalog_image_slide_two_c27833cd_2a5a2156.jpg',
    title: 'Cor que Chama Atenção',
    caption: 'Frutos frescos com coloração amarelo-ouro intensa.',
  },
  {
    id: 3,
    src: '/assets/aistudio/image.png_1a138aa9_cd6f128d.jpg',
    title: 'Aprovado pelos Grandes Nomes',
    caption: 'Qualidade Ouro do Cerrado nas melhores mesas.',
  },
  {
    id: 4,
    src: '/assets/aistudio/image.png_82afff85_75869007.jpg',
    title: 'Sucesso Absoluto de Sabor',
    caption: 'Embalagens selecionadas a vácuo mantendo o frescor.',
  },
  {
    id: 5,
    src: '/assets/aistudio/Designing_pequi_meal_catalog_slide_ce0b2ffe_15e856d0.jpg',
    title: 'Dá Vontade de Levar para Casa',
    caption: 'Com frango, arroz soltinho e receitas cheias de tradição.',
  },
  {
    id: 6,
    src: '/assets/aistudio/Design_catalog_image_for_pequi_1ad4c00f_5f1b2836.jpg',
    title: 'O Cerrado em Cada Detalhe',
    caption: 'Fruto aberto revelando caroços super graúdos e carnudos.',
  },
  {
    id: 7,
    src: '/assets/aistudio/pequiourodocerrado_CV4AVx5NGud.jpg_4649f7f8_1b46af11.jpg',
    title: 'Uma Explosão de Sabor',
    caption: 'Caldo rico e encorpado com cheiro-verde e pequi macio.',
  },
  {
    id: 8,
    src: '/assets/aistudio/Create_packaged_pequi_product_ad__c2c1ef7b_32744707.jpg',
    title: 'Padrão Superior de Seleção',
    caption: 'Polpa espessa e uniforme em cada fruto selecionado.',
  },
  {
    id: 9,
    src: '/assets/aistudio/Generating_television_news_food___37b48da6_f16cad7e.jpg',
    title: 'Destaque em Rede Nacional',
    caption: 'Reconhecido pela qualidade e importância cultural.',
  },
  {
    id: 10,
    src: '/assets/aistudio/Generate_catalog_image_for_pequi_91c2c057_f86fff39.jpg',
    title: 'Apresentação Impecável',
    caption: 'Bandejas e pacotes higienizados prontos para consumo.',
  },
  {
    id: 11,
    src: '/assets/aistudio/Designing_pequi_food_advertising__ebf24c8e_1da109cd.jpg',
    title: 'Quem Experimenta, Conta',
    caption: '“Nunca comi um pequi tão carnudo, amei demais.”',
  },
  {
    id: 12,
    src: '/assets/aistudio/pequiourodocerrado_Cbqv4Ohtn0o.jpg_8af559ec_91e24d5c.jpg',
    title: 'Da Roça Direto para Sua Panela',
    caption: 'Rendimento extraordinário no prato e sabor autêntico.',
  },
  {
    id: 13,
    src: '/assets/aistudio/pequiourodocerrado_CXd75xhOBOh.jpg_21dc9726_e9481b20.jpg',
    title: 'Colheita Especial do Cerrado',
    caption: 'Frutos gigantes colhidos no ponto exato de maturação.',
  },
  {
    id: 14,
    src: '/assets/aistudio/WhatsApp_Image_2026-10-29_at_15.43.24.jpeg_2d25caa4_7fb62d06.jpg',
    title: 'Alta Gastronomia Regional',
    caption: 'Prato finalizado com pequi dourado e ervas frescas.',
  },
  {
    id: 15,
    src: '/assets/aistudio/560299441_18075773839892426_7953378209330729712_n.jpg_502674ca_754d84de.jpg',
    title: 'Preparo Tradicional no Fogão',
    caption: 'Frango caipira na panela com Pequi Ouro do Cerrado.',
  },
  {
    id: 16,
    src: '/assets/aistudio/575977704_18349507930167276_81649842959911492_n.jpg_99d099d9_9cb9a969.jpg',
    title: 'Aprovação Total dos Clientes',
    caption: 'Feedback real: pequi carnudo e saboroso o ano inteiro.',
  },
  {
    id: 17,
    src: '/assets/aistudio/561897155_18077993594027586_3637217037057836595_n.jpg_35532754_1a7ef2ff.jpg',
    title: 'Clientes Fiéis em Todo o Brasil',
    caption: '“Ganharam uma cliente fiel, já mandei para a família toda!”',
  },
  {
    id: 18,
    src: '/assets/aistudio/560601866_18093660001748398_5283805647267496396_n.jpg_7ff8444b_795129a2.jpg',
    title: 'Sabor Docinho e Marcante',
    caption: '“O mais gostoso pra mim foi o gigante, super docinho!”',
  },
];
