/** Lif rehberi: hangi ip neye uygun? */
import type { FiberId } from '@/types';
import type { L10n } from '@/i18n';

const l = (tr: string, en: string, es: string, pt: string): L10n => ({ tr, en, es, pt });

export interface FiberInfo {
  id: FiberId;
  name: L10n;
  /** 1–5 */
  warmth: number;
  /** esneme/hafıza 1–5 */
  elasticity: number;
  /** ilmek belirginliği 1–5 */
  stitchDefinition: number;
  care: L10n;
  bestFor: L10n[];
  avoidFor?: L10n[];
  tip: L10n;
}

export const FIBERS: FiberInfo[] = [
  {
    id: 'yun',
    name: l('Yün', 'Wool', 'Lana', 'Lã'),
    warmth: 5,
    elasticity: 5,
    stitchDefinition: 4,
    care: l('Elde soğuk suda, sıkmadan yıka; düz kurut. Keçeleşebilir.', 'Hand wash cold without wringing; dry flat. Can felt.', 'Lavar a mano en frío sin retorcer; secar en plano. Puede afieltrarse.', 'Lavar à mão em água fria sem torcer; secar na horizontal. Pode feltrar.'),
    bestFor: [l('Kazak', 'Sweaters', 'Jerséis', 'Suéteres'), l('Bere', 'Hats', 'Gorros', 'Gorros'), l('Eldiven', 'Mittens', 'Manoplas', 'Luvas'), l('Burgu', 'Cables', 'Ochos', 'Tranças')],
    tip: l('Esnekliği sayesinde lastik ve burgular en güzel yünde görünür. Islak dinlendirme ile ölçü düzelir.', 'Its bounce makes ribbing and cables look their best. Wet blocking evens out the stitches.', 'Su elasticidad luce elásticos y ochos. El bloqueo en húmedo empareja los puntos.', 'A elasticidade valoriza ribanas e tranças. Bloquear úmido deixa os pontos uniformes.'),
  },
  {
    id: 'merino',
    name: l('Merino yün', 'Merino wool', 'Lana merino', 'Lã merino'),
    warmth: 5,
    elasticity: 5,
    stitchDefinition: 5,
    care: l('Elde yıka; "superwash" ise makinede yün programı.', 'Hand wash; "superwash" can go in a wool machine cycle.', 'A mano; si es "superwash", en programa de lana.', 'À mão; se for "superwash", no ciclo de lã da máquina.'),
    bestFor: [l('Bebek giysisi', 'Baby clothes', 'Ropa de bebé', 'Roupa de bebê'), l('Tene değen her şey', 'Next-to-skin wear', 'Prendas en contacto con la piel', 'Peças em contato com a pele'), l('Şal', 'Shawls', 'Chales', 'Xales')],
    tip: l('Kaşındırmayan yün. Superwash merino yıkanınca uzayabilir; ölçü örneğini yıkayıp ölç.', 'Soft, non-itchy wool. Superwash merino can grow when washed: wash your swatch before measuring.', 'Lana suave que no pica. La merino superwash puede estirarse al lavar: lava la muestra antes de medir.', 'Lã macia que não pinica. A merino superwash pode esticar ao lavar: lave a amostra antes de medir.'),
  },
  {
    id: 'alpaka',
    name: l('Alpaka', 'Alpaca', 'Alpaca', 'Alpaca'),
    warmth: 5,
    elasticity: 2,
    stitchDefinition: 3,
    care: l('Elde yıka, düz kurut.', 'Hand wash, dry flat.', 'Lavar a mano, secar en plano.', 'Lavar à mão, secar na horizontal.'),
    bestFor: [l('Atkı', 'Scarves', 'Bufandas', 'Cachecóis'), l('Şal', 'Shawls', 'Chales', 'Xales'), l('Bol kazak', 'Loose sweaters', 'Jerséis holgados', 'Suéteres soltos')],
    avoidFor: [l('Dar lastikli giysi', 'Fitted ribbed garments', 'Prendas ajustadas con elástico', 'Peças justas com ribana')],
    tip: l('Koyun yününden sıcaktır ama hafızası azdır; ağırlıkla sarkabilir. Yünle karışık olanı daha formlu durur.', 'Warmer than sheep wool but with little memory, so it can sag. Wool blends hold their shape better.', 'Más cálida que la oveja pero con poca memoria: puede dar de sí. Las mezclas con lana mantienen mejor la forma.', 'Mais quente que lã de ovelha mas com pouca memória: pode ceder. Misturas com lã mantêm melhor a forma.'),
  },
  {
    id: 'moher',
    name: l('Moher', 'Mohair', 'Mohair', 'Mohair'),
    warmth: 4,
    elasticity: 3,
    stitchDefinition: 1,
    care: l('Elde, çok nazik.', 'Hand wash very gently.', 'A mano, con mucho cuidado.', 'À mão, com muito cuidado.'),
    bestFor: [l('Havlı şal', 'Fuzzy shawls', 'Chales esponjosos', 'Xales felpudos'), l('Başka iple çift katlı örme', 'Holding double with another yarn', 'Tejer a doble hebra con otro hilo', 'Tricotar com fio duplo junto a outro')],
    tip: l('Söküldüğünde tüyler birbirine girer. Sökmeden önce işi dondurucuda bekletmek kolaylaştırır.', 'The halo tangles when you rip back. Popping the piece in the freezer first makes frogging easier.', 'El pelo se enreda al deshacer. Meter la labor en el congelador antes ayuda.', 'Os pelos embaraçam ao desmanchar. Colocar a peça no congelador antes ajuda.'),
  },
  {
    id: 'kasmir',
    name: l('Kaşmir', 'Cashmere', 'Cachemira', 'Caxemira'),
    warmth: 5,
    elasticity: 3,
    stitchDefinition: 3,
    care: l('Elde, soğuk suda.', 'Hand wash cold.', 'A mano, en frío.', 'À mão, em água fria.'),
    bestFor: [l('Lüks atkı', 'Luxury scarves', 'Bufandas de lujo', 'Cachecóis de luxo'), l('Bere', 'Hats', 'Gorros', 'Gorros')],
    tip: l('Az miktarı bile çok yumuşak bir dokunuş verir.', 'Even a small amount gives a beautifully soft touch.', 'Incluso un poco aporta una suavidad increíble.', 'Mesmo um pouco dá um toque muito macio.'),
  },
  {
    id: 'pamuk',
    name: l('Pamuk', 'Cotton', 'Algodón', 'Algodão'),
    warmth: 2,
    elasticity: 1,
    stitchDefinition: 5,
    care: l('Makinede yıkanabilir; çekebilir.', 'Machine washable; may shrink.', 'Lavable a máquina; puede encoger.', 'Lavável na máquina; pode encolher.'),
    bestFor: [l('Amigurumi', 'Amigurumi', 'Amigurumi', 'Amigurumi'), l('Yazlık bluz', 'Summer tops', 'Blusas de verano', 'Blusas de verão'), l('Mutfak bezi', 'Dishcloths', 'Paños de cocina', 'Panos de prato'), l('Bebek', 'Baby items', 'Cosas de bebé', 'Peças de bebê')],
    avoidFor: [l('Esnek lastik gereken yaka', 'Stretchy ribbed collars', 'Cuellos elásticos', 'Golas elásticas')],
    tip: l('Esnemediği için gergin örülür; elin yorulursa bir numara büyük tığ veya şiş dene. Amigurumide net ilmek verir.', 'It has no stretch, so it feels tight to work: go up a needle or hook size if your hands tire. Gives crisp amigurumi stitches.', 'No estira, así que se teje tenso: sube un número si se cansan las manos. Da puntos nítidos en amigurumi.', 'Não estica, então fica tenso de trabalhar: aumente um número se as mãos cansarem. Dá pontos nítidos em amigurumi.'),
  },
  {
    id: 'keten',
    name: l('Keten', 'Linen', 'Lino', 'Linho'),
    warmth: 1,
    elasticity: 1,
    stitchDefinition: 4,
    care: l('Yıkadıkça yumuşar.', 'Gets softer with every wash.', 'Se suaviza con cada lavado.', 'Fica mais macio a cada lavagem.'),
    bestFor: [l('Yazlık', 'Summer wear', 'Prendas de verano', 'Peças de verão'), l('Çanta', 'Bags', 'Bolsos', 'Bolsas'), l('Havlu', 'Towels', 'Toallas', 'Toalhas')],
    tip: l('İlk başta sert gelir; birkaç yıkamadan sonra çok güzel dökülür.', 'Stiff at first, it drapes beautifully after a few washes.', 'Rígido al principio, cae precioso tras unos lavados.', 'Duro no início, cai lindamente depois de algumas lavagens.'),
  },
  {
    id: 'bambu',
    name: l('Bambu', 'Bamboo', 'Bambú', 'Bambu'),
    warmth: 2,
    elasticity: 1,
    stitchDefinition: 3,
    care: l('Elde yıka, düz kurut.', 'Hand wash, dry flat.', 'A mano, secar en plano.', 'À mão, secar na horizontal.'),
    bestFor: [l('Yazlık şal', 'Summer shawls', 'Chales de verano', 'Xales de verão'), l('Bebek', 'Baby items', 'Cosas de bebé', 'Peças de bebê')],
    tip: l('Kaygan ve parlaktır, şişten kaçabilir. Bambu ya da ahşap şiş tercih et.', 'Slippery and shiny, it can slide off: prefer bamboo or wooden needles.', 'Resbaladizo y brillante: mejor agujas de bambú o madera.', 'Escorregadio e brilhante: prefira agulhas de bambu ou madeira.'),
  },
  {
    id: 'ipek',
    name: l('İpek', 'Silk', 'Seda', 'Seda'),
    warmth: 3,
    elasticity: 1,
    stitchDefinition: 4,
    care: l('Elde, çok nazik.', 'Hand wash very gently.', 'A mano, con mucho cuidado.', 'À mão, com muito cuidado.'),
    bestFor: [l('Şal', 'Shawls', 'Chales', 'Xales'), l('Dantel', 'Lace', 'Encaje', 'Renda')],
    tip: l('Parlaklığı ajur desenleri öne çıkarır.', 'Its sheen makes lace patterns shine.', 'Su brillo realza los calados.', 'O brilho valoriza os pontos rendados.'),
  },
  {
    id: 'akrilik',
    name: l('Akrilik', 'Acrylic', 'Acrílico', 'Acrílico'),
    warmth: 3,
    elasticity: 3,
    stitchDefinition: 3,
    care: l('Makinede yıkanır; buharla (dokunmadan) dinlendirilir.', 'Machine washable; block with steam without touching the iron to it.', 'Lavable a máquina; bloquear con vapor sin apoyar la plancha.', 'Lavável na máquina; bloquear com vapor sem encostar o ferro.'),
    bestFor: [l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Oyuncak', 'Toys', 'Juguetes', 'Brinquedos'), l('Çocuk giysisi', 'Kids wear', 'Ropa infantil', 'Roupa infantil'), l('Pratik yapmak', 'Practice', 'Practicar', 'Praticar')],
    avoidFor: [l('Islak dinlendirme isteyen ajur', 'Lace that needs wet blocking', 'Calados que necesitan bloqueo en húmedo', 'Rendas que precisam de bloqueio úmido')],
    tip: l('Uygun fiyatlı, renkli, kolay bakımlı. Islak dinlendirmeye tepki vermez; buharla dinlendirilir.', 'Affordable, colorful, easy care. It ignores wet blocking: use steam instead.', 'Económico, colorido y fácil de cuidar. No responde al bloqueo en húmedo: usa vapor.', 'Barato, colorido e fácil de cuidar. Não responde ao bloqueio úmido: use vapor.'),
  },
  {
    id: 'polyester',
    name: l('Polyester', 'Polyester', 'Poliéster', 'Poliéster'),
    warmth: 3,
    elasticity: 2,
    stitchDefinition: 2,
    care: l('Makinede yıkanır.', 'Machine washable.', 'Lavable a máquina.', 'Lavável na máquina.'),
    bestFor: [l('Battaniye', 'Blankets', 'Mantas', 'Mantas'), l('Oyuncak', 'Toys', 'Juguetes', 'Brinquedos')],
    tip: l('Dayanıklı ve hafiftir.', 'Durable and lightweight.', 'Resistente y ligero.', 'Resistente e leve.'),
  },
  {
    id: 'kadife',
    name: l('Kadife (şönil)', 'Chenille (velvet)', 'Chenilla', 'Chenille'),
    warmth: 4,
    elasticity: 1,
    stitchDefinition: 1,
    care: l('Makinede hassas programda.', 'Machine wash on delicate.', 'A máquina en programa delicado.', 'Na máquina, ciclo delicado.'),
    bestFor: [l('Peluş amigurumi', 'Plush amigurumi', 'Amigurumi de peluche', 'Amigurumi de pelúcia'), l('Bebek battaniyesi', 'Baby blankets', 'Mantas de bebé', 'Mantas de bebê')],
    tip: l('İlmekler zor görünür: her turun başına işaretleyici tak. Gergin örersen ilmekler kayıp "solucanlanır".', 'Stitches are hard to see: mark the start of every round. Working too tight makes loops pop out ("worming").', 'Los puntos se ven poco: marca el inicio de cada vuelta. Si tejes apretado, los bucles se salen.', 'Os pontos aparecem pouco: marque o início de cada volta. Se apertar demais, as alças saltam.'),
  },
  {
    id: 'penye',
    name: l('Penye ip', 'T-shirt yarn', 'Trapillo', 'Fio de malha'),
    warmth: 2,
    elasticity: 3,
    stitchDefinition: 3,
    care: l('Makinede yıkanır.', 'Machine washable.', 'Lavable a máquina.', 'Lavável na máquina.'),
    bestFor: [l('Sepet', 'Baskets', 'Cestas', 'Cestos'), l('Çanta', 'Bags', 'Bolsos', 'Bolsas'), l('Paspas', 'Rugs', 'Alfombras', 'Tapetes')],
    tip: l('Kalın tığla (8–12 mm) sık örülür; sağlam, şekil tutan sepetler verir.', 'Worked tightly with a big hook (8–12 mm) for sturdy baskets that hold their shape.', 'Se teje apretado con aguja gruesa (8–12 mm) para cestas firmes.', 'Trabalhado firme com agulha grossa (8–12 mm) para cestos firmes.'),
  },
  {
    id: 'naylon',
    name: l('Naylon (poliamid)', 'Nylon', 'Nailon (poliamida)', 'Náilon (poliamida)'),
    warmth: 2,
    elasticity: 4,
    stitchDefinition: 3,
    care: l('Makinede yıkanır.', 'Machine washable.', 'Lavable a máquina.', 'Lavável na máquina.'),
    bestFor: [l('Çorap (yünle karışık)', 'Socks (blended with wool)', 'Calcetines (mezclado con lana)', 'Meias (misturado com lã)')],
    tip: l('Çorap iplerindeki %20–25 naylon topuk ve burnu dayanıklı yapar.', 'The 20–25% nylon in sock yarn makes heels and toes last.', 'El 20–25 % de nailon en hilo de calcetines refuerza talón y puntera.', 'Os 20–25% de náilon no fio de meia reforçam calcanhar e ponta.'),
  },
  {
    id: 'viskon',
    name: l('Viskon', 'Viscose', 'Viscosa', 'Viscose'),
    warmth: 2,
    elasticity: 1,
    stitchDefinition: 3,
    care: l('Elde, nazik.', 'Hand wash gently.', 'A mano, con cuidado.', 'À mão, com cuidado.'),
    bestFor: [l('Yazlık bluz', 'Summer tops', 'Blusas de verano', 'Blusas de verão')],
    tip: l('Ağır ve dökümlüdür; uzayabilir.', 'Heavy and drapey; it can stretch.', 'Pesada y con caída; puede estirarse.', 'Pesada e com caimento; pode esticar.'),
  },
  {
    id: 'karisim',
    name: l('Karışım', 'Blend', 'Mezcla', 'Mistura'),
    warmth: 3,
    elasticity: 3,
    stitchDefinition: 3,
    care: l('Etiketteki en hassas life göre.', 'Follow the most delicate fiber on the label.', 'Según la fibra más delicada de la etiqueta.', 'Siga a fibra mais delicada da etiqueta.'),
    bestFor: [l('Her şey', 'Everything', 'Todo', 'Tudo')],
    tip: l('Karışımlar liflerin iyi yanlarını birleştirir: yün ve akrilik hem sıcak hem kolay bakımlıdır.', 'Blends combine strengths: wool plus acrylic is warm and easy care.', 'Las mezclas suman ventajas: lana y acrílico es cálida y fácil de cuidar.', 'Misturas somam vantagens: lã com acrílico é quente e fácil de cuidar.'),
  },
];

export const FIBER_BY_ID: Record<FiberId, FiberInfo> = Object.fromEntries(FIBERS.map((f) => [f.id, f])) as Record<FiberId, FiberInfo>;
