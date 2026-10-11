/**
 * Desen kütüphanesi: şiş ve tığ desenleri.
 *
 * Şiş grafikleri ÖN YÜZDEN GÖRÜNÜŞÜ anlatır (alttan üste satırlar, soldan sağa karakterler).
 * Düz örgüde ön yüz sıraları sağdan sola, arka yüz sıraları soldan sağa okunur.
 * Karakter haritası (şiş):
 *   .  düz          -  ters         o  ip at       /  2 birlikte düz   \  kaydır-kaydır-ör
 *   ^  merkezden çift eksiltme      v  kaydır (ip arkada)   f  kaydır (ip önde)
 *   t  burgulu düz   b  pıtırcık    x  ilmek yok
 *   l  1/1 sola burgu  r  1/1 sağa burgu  L  2/2 sola  R  2/2 sağa  K  3/3 sola  Q  3/3 sağa
 *   >  önceki çok hücreli sembolün devamı
 * Karakter haritası (tığ):
 *   c zincir  s kör ilmek  + sık iğne  h yarım trabzan  d trabzan(1 ip atma)  D trabzan(2 ip atma)
 *   V V ilmek  S yelpaze  P fıstık  B pıtırcık  F ön kabartma  K arka kabartma  _ boş
 *
 * Tığ metinlerinde {sc}, {hdc}, {dc}, {tr} yer tutucuları kullanıcının trabzan sistemine göre doldurulur (fillTerms).
 */
import type { Craft } from '@/types';

export interface PatternRow {
  label: string;
  text: string;
}

export interface PatternWorking {
  /** ilmek sayısı = multiple·k + plus */
  multiple: number;
  plus: number;
  rows: PatternRow[];
  /** "1.–4. sıraları tekrarla" gibi */
  repeat?: string;
  note?: string;
}

export type PatternCategory = 'temel' | 'lastik' | 'doku' | 'ajur' | 'burgu' | 'selanik' | 'tig-temel' | 'tig-doku';

export interface StitchPattern {
  id: string;
  craft: Craft;
  name: string;
  aka?: string[];
  en: string;
  level: 1 | 2 | 3;
  category: PatternCategory;
  summary: string;
  flat: PatternWorking;
  round?: PatternWorking;
  /** alttan üste satırlar */
  chart?: string[];
  /** grafik yalnızca temsilîyse (ör. selanik) */
  chartIsApprox?: boolean;
  reversible: boolean;
  curls: boolean;
  /** aynı ilmek sayısında jarseye göre genişlik oranı (lastik büzer: <1) */
  widthFactor: number;
  /** aynı yükseklikte jarseye göre sıra sayısı oranı (haraşo sıkışır: >1) */
  rowFactor: number;
  /** aynı alan için jarseye göre ip oranı */
  yarnFactor: number;
  uses: string[];
  tips: string[];
  lessonIds: string[];
}

export const KNIT_CHART_CHARS: Record<string, string> = {
  '.': 'k',
  '-': 'p',
  o: 'yo',
  '/': 'k2tog',
  '\\': 'ssk',
  '^': 'cdd',
  v: 'sl',
  f: 'slf',
  t: 'ktbl',
  b: 'mb',
  x: 'ns',
  l: 'c2l',
  r: 'c2r',
  L: 'c4l',
  R: 'c4r',
  K: 'c6l',
  Q: 'c6r',
};

export const CROCHET_CHART_CHARS: Record<string, string> = {
  c: 'ch',
  s: 'slst',
  '+': 'sc',
  h: 'hdc',
  d: 'dc',
  D: 'tr',
  V: 'v',
  S: 'shell',
  P: 'puff',
  B: 'bobble',
  F: 'fpdc',
  K: 'bpdc',
};

export const STITCH_PATTERNS: StitchPattern[] = [
  /* ── Şiş: temel ───────────────────────────────────────── */
  {
    id: 'haraso',
    craft: 'knit',
    name: 'Haraşo',
    aka: ['Her sıra düz'],
    en: 'Garter stitch',
    level: 1,
    category: 'temel',
    summary: 'Her sıra düz örülür. İki yüzü aynı, yatay "tırtıl" çizgili, kıvrılmayan, esnek bir kumaş verir. İlk örgü için en iyi başlangıç.',
    flat: { multiple: 1, plus: 0, rows: [{ label: 'Her sıra', text: 'Tüm ilmekleri düz ör.' }] },
    round: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: '1. tur', text: 'Tüm ilmekleri düz ör.' },
        { label: '2. tur', text: 'Tüm ilmekleri ters ör.' },
      ],
      repeat: '1. ve 2. turları tekrarla.',
      note: 'Yuvarlak örgüde iş hiç dönmediği için haraşo görüntüsü için turlar sırayla düz ve ters örülür.',
    },
    chart: ['....................', '--------------------'],
    reversible: true,
    curls: false,
    widthFactor: 1.05,
    rowFactor: 1.5,
    yarnFactor: 1.05,
    uses: ['İlk atkı', 'Bebek battaniyesi', 'Jarse işlerin kenarı'],
    tips: ['İki sıra bir "tırtıl" (sırt) yapar. Sıra saymak için tırtılları say ve 2 ile çarp.', 'Kenarları düzgün olsun istersen her sıranın ilk ilmeğini örmeden kaydır.'],
    lessonIds: ['sis-duz-ilmek', 'sis-haraso'],
  },
  {
    id: 'jarse',
    craft: 'knit',
    name: 'Jarse',
    aka: ['Düz örgü', 'Süveter örgüsü'],
    en: 'Stockinette stitch',
    level: 1,
    category: 'temel',
    summary: 'Ön yüzde düz, arka yüzde ters örülür. Ön yüzde düzgün "V" sütunları, arkada boncuklu bir yüzey. Kenarları kendiliğinden kıvrılır.',
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: '1. sıra (ön yüz)', text: 'Tüm ilmekleri düz ör.' },
        { label: '2. sıra (arka yüz)', text: 'Tüm ilmekleri ters ör.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
    },
    round: { multiple: 1, plus: 0, rows: [{ label: 'Her tur', text: 'Tüm ilmekleri düz ör.' }] },
    chart: ['....................'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: ['Kazak', 'Bere gövdesi', 'Renkli (desenli) örgü'],
    tips: ['Kıvrılmayı önlemek için kenarlara 3–4 ilmek haraşo ya da pirinç bordür ekle.', 'Ölçü örneği çoğu tarifte jarse ile verilir.'],
    lessonIds: ['sis-duz-ilmek', 'sis-ters-ilmek', 'sis-jarse'],
  },
  {
    id: 'ters-jarse',
    craft: 'knit',
    name: 'Ters jarse',
    en: 'Reverse stockinette',
    level: 1,
    category: 'temel',
    summary: 'Jarsenin boncuklu yüzünün ön yüz olarak kullanılması. Burgu desenlerinin zemini olarak çok sık görülür.',
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: '1. sıra (ön yüz)', text: 'Tüm ilmekleri ters ör.' },
        { label: '2. sıra (arka yüz)', text: 'Tüm ilmekleri düz ör.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
    },
    round: { multiple: 1, plus: 0, rows: [{ label: 'Her tur', text: 'Tüm ilmekleri ters ör.' }] },
    chart: ['--------------------'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: ['Burgu zemini', 'Doku kontrastı'],
    tips: ['Ters ilmek düzden biraz gevşek çıkabilir; fark varsa ters sıralarda ipi bir tık daha sıkı tut.'],
    lessonIds: ['sis-ters-ilmek'],
  },
  /* ── Şiş: lastikler ───────────────────────────────────── */
  {
    id: 'lastik-1x1',
    craft: 'knit',
    name: '1×1 lastik',
    aka: ['Bir düz bir ters'],
    en: '1×1 rib',
    level: 1,
    category: 'lastik',
    summary: 'Bir düz, bir ters. Çok esner ve geri toplanır; bere ağzı, kol ve yaka için klasik.',
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: '1. sıra (ön yüz)', text: '1 düz, *1 ters, 1 düz* sıra sonuna kadar tekrarla.' },
        { label: '2. sıra (arka yüz)', text: '1 ters, *1 düz, 1 ters* sıra sonuna kadar tekrarla.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
      note: 'Kural: ilmeği nasıl görüyorsan öyle ör. "V" gördüğün ilmeği düz, boncuk gördüğünü ters ör.',
    },
    round: { multiple: 2, plus: 0, rows: [{ label: 'Her tur', text: '*1 düz, 1 ters* tur sonuna kadar tekrarla.' }] },
    chart: ['.-.-.-.-.-.-.-.-.-.'],
    reversible: true,
    curls: false,
    widthFactor: 0.75,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: ['Bere ağzı', 'Kol ve etek ucu', 'Yaka'],
    tips: ['Düzden terse geçerken ipi şişlerin ARASINDAN öne al; terse geçerken arkaya götürme. İpi şişin üstünden aşırırsan istemeden ip atmış olursun.', 'Lastiği ana örgüden 0,5–1 numara ince şişle örmek daha toplu durur.'],
    lessonIds: ['sis-lastik'],
  },
  {
    id: 'lastik-2x2',
    craft: 'knit',
    name: '2×2 lastik',
    aka: ['İki düz iki ters'],
    en: '2×2 rib',
    level: 1,
    category: 'lastik',
    summary: 'İki düz, iki ters. 1×1 lastikten daha belirgin dikey çizgiler, aynı esneklik.',
    flat: {
      multiple: 4,
      plus: 2,
      rows: [
        { label: '1. sıra (ön yüz)', text: '2 düz, *2 ters, 2 düz* sıra sonuna kadar tekrarla.' },
        { label: '2. sıra (arka yüz)', text: '2 ters, *2 düz, 2 ters* sıra sonuna kadar tekrarla.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
    },
    round: { multiple: 4, plus: 0, rows: [{ label: 'Her tur', text: '*2 düz, 2 ters* tur sonuna kadar tekrarla.' }] },
    chart: ['..--..--..--..--..'],
    reversible: true,
    curls: false,
    widthFactor: 0.72,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: ['Bere', 'Atkı', 'Kazak etekleri', 'Çorap konçu'],
    tips: ['Düz örgüde 4\'ün katı + 2 ilmek atınca iki kenar da 2 düz ile başlar ve biter, atkı simetrik olur.'],
    lessonIds: ['sis-lastik'],
  },
  {
    id: 'burgulu-lastik',
    craft: 'knit',
    name: 'Burgulu lastik',
    en: 'Twisted rib',
    level: 2,
    category: 'lastik',
    summary: 'Düz ilmekler arka bacaktan örülür, ilmekler burularak ip gibi keskin çizgiler oluşturur.',
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: '1. sıra (ön yüz)', text: '1 burgulu düz (arka bacaktan), *1 ters, 1 burgulu düz* tekrarla.' },
        { label: '2. sıra (arka yüz)', text: '1 ters, *1 düz, 1 ters* tekrarla.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
    },
    round: { multiple: 2, plus: 0, rows: [{ label: 'Her tur', text: '*1 burgulu düz, 1 ters* tekrarla.' }] },
    chart: ['t-t-t-t-t-t-t-t-t-t', 't-t-t-t-t-t-t-t-t-t'],
    reversible: false,
    curls: false,
    widthFactor: 0.72,
    rowFactor: 1.05,
    yarnFactor: 1.05,
    uses: ['Çorap', 'Eldiven bilekliği', 'Dar yaka'],
    tips: ['Burgulu ilmek daha az esner ama çok düzgün ve şık görünür.'],
    lessonIds: ['sis-lastik'],
  },
  /* ── Şiş: doku ────────────────────────────────────────── */
  {
    id: 'pirinc',
    craft: 'knit',
    name: 'Pirinç örgü',
    aka: ['Pirinç'],
    en: 'Seed stitch',
    level: 1,
    category: 'doku',
    summary: 'Bir düz bir ters, ama her sırada kaydırılarak: düzün üstüne ters, tersin üstüne düz gelir. Pirinç taneleri gibi noktalı, kıvrılmayan, iki yüzü aynı kumaş.',
    flat: {
      multiple: 2,
      plus: 1,
      rows: [{ label: 'Her sıra', text: '1 düz, *1 ters, 1 düz* sıra sonuna kadar tekrarla.' }],
      note: 'Tek sayıda ilmekle her sıra aynı talimatla örülür ve desen kendiliğinden kayar. Kural: "V" görünen ilmeği ters, boncuk görüneni düz ör.',
    },
    round: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: '1. tur', text: '*1 düz, 1 ters* tekrarla.' },
        { label: '2. tur', text: '*1 ters, 1 düz* tekrarla.' },
      ],
      repeat: '1. ve 2. turları tekrarla.',
    },
    chart: ['.-.-.-.-.-.-.-.-.-.', '-.-.-.-.-.-.-.-.-.-'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1.15,
    yarnFactor: 1.08,
    uses: ['Kenar bordürü', 'Bebek battaniyesi', 'Bardak altlığı', 'Atkı'],
    tips: ['Lastikle karıştırma: lastikte ilmeği gördüğün gibi örersin, pirinçte tam tersini.'],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'cift-pirinc',
    craft: 'knit',
    name: 'Çift pirinç',
    aka: ['Moss örgü'],
    en: 'Moss stitch (US) / Double moss (UK)',
    level: 2,
    category: 'doku',
    summary: 'Pirinç örgünün iki sırada bir kayan hâli. Daha uzun "taneler", yine kıvrılmaz ve iki yüzü aynı.',
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: '1. sıra', text: '*1 düz, 1 ters* tekrarla.' },
        { label: '2. sıra', text: '*1 düz, 1 ters* tekrarla.' },
        { label: '3. sıra', text: '*1 ters, 1 düz* tekrarla.' },
        { label: '4. sıra', text: '*1 ters, 1 düz* tekrarla.' },
      ],
      repeat: '1.–4. sıraları tekrarla.',
    },
    round: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: '1. ve 2. tur', text: '*1 düz, 1 ters* tekrarla.' },
        { label: '3. ve 4. tur', text: '*1 ters, 1 düz* tekrarla.' },
      ],
      repeat: '1.–4. turları tekrarla.',
    },
    chart: ['-.-.-.-.-.-.-.-.-.-.', '-.-.-.-.-.-.-.-.-.-.', '.-.-.-.-.-.-.-.-.-.-', '.-.-.-.-.-.-.-.-.-.-'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1.12,
    yarnFactor: 1.08,
    uses: ['Hırka', 'Yastık kılıfı', 'Kenar'],
    tips: ['Çift sayıda ilmekle 1. ve 2. sıralar aynı talimatla örülür ama görüntüde düzün üstüne düz gelir; 3. sırada kayar.'],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'sepet',
    craft: 'knit',
    name: 'Sepet örgü',
    aka: ['Hasır blok'],
    en: 'Basketweave',
    level: 2,
    category: 'doku',
    summary: 'Düz ve ters bloklar dama tahtası gibi yer değiştirir; hasır sepet görünümü. Kıvrılmaz.',
    flat: {
      multiple: 8,
      plus: 4,
      rows: [
        { label: '1. ve 3. sıra (ön yüz)', text: '*4 düz, 4 ters*, 4 düz.' },
        { label: '2. ve 4. sıra (arka yüz)', text: '4 ters, *4 düz, 4 ters*.' },
        { label: '5. ve 7. sıra (ön yüz)', text: '*4 ters, 4 düz*, 4 ters.' },
        { label: '6. ve 8. sıra (arka yüz)', text: '4 düz, *4 ters, 4 düz*.' },
      ],
      repeat: '1.–8. sıraları tekrarla.',
    },
    round: {
      multiple: 8,
      plus: 0,
      rows: [
        { label: '1.–4. tur', text: '*4 düz, 4 ters* tekrarla.' },
        { label: '5.–8. tur', text: '*4 ters, 4 düz* tekrarla.' },
      ],
      repeat: '1.–8. turları tekrarla.',
    },
    chart: ['....----....----....', '....----....----....', '....----....----....', '....----....----....', '----....----....----', '----....----....----', '----....----....----', '----....----....----'],
    reversible: true,
    curls: false,
    widthFactor: 0.95,
    rowFactor: 1.08,
    yarnFactor: 1.08,
    uses: ['Battaniye', 'Yastık', 'Bulaşık bezi'],
    tips: ['Blok boyunu ve enini aynı tutmak için blok yüksekliğini ölçü örneğine göre 4 yerine 5–6 sıra yapabilirsin.'],
    lessonIds: ['sis-pirinc'],
  },
  {
    id: 'hasir',
    craft: 'knit',
    name: 'Hasır örgü',
    aka: ['Keten örgü'],
    en: 'Linen stitch',
    level: 2,
    category: 'doku',
    summary: 'İp önde kaydırılan ilmekler kumaşın önüne küçük yatay çubuklar bırakır; dokuma kumaş gibi sık ve düz bir yüzey.',
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: '1. sıra (ön yüz)', text: '*1 düz, ip önde 1 ilmeği ters örer gibi kaydır, ipi arkaya al* tekrarla.' },
        { label: '2. sıra (arka yüz)', text: '*1 ters, ip arkada 1 ilmeği ters örer gibi kaydır, ipi öne al* tekrarla.' },
      ],
      repeat: '1. ve 2. sıraları tekrarla.',
      note: 'Çok sık bir kumaş verir; ana iş için önerilenden 1–2 numara kalın şiş kullan.',
    },
    chart: ['f.f.f.f.f.f.f.f.f.f.', '.f.f.f.f.f.f.f.f.f.f'],
    reversible: false,
    curls: false,
    widthFactor: 0.82,
    rowFactor: 1.8,
    yarnFactor: 1.25,
    uses: ['Çanta', 'Bulaşık bezi', 'Renkli şerit atkı'],
    tips: ['Her sıra başında ipi değiştirerek iki renkle örünce çok güzel karışık bir doku olur.'],
    lessonIds: ['sis-kaydirma'],
  },
  /* ── Şiş: selanik ailesi ──────────────────────────────── */
  {
    id: 'yalanci-selanik',
    craft: 'knit',
    name: 'Yalancı selanik',
    en: 'Mock rib (selanik görünümlü)',
    level: 1,
    category: 'selanik',
    summary: 'Her sıra aynı talimatla örülen, selaniğe benzeyen kalın, esnek ve iki yüzü benzer bir desen. Gerçek selanikten çok daha kolay ve az ip harcar.',
    flat: {
      multiple: 4,
      plus: 1,
      rows: [{ label: 'Her sıra', text: '*3 ters, 1 düz* sıra sonuna kadar tekrarla, son ilmeği ters ör.' }],
      note: 'İlmek sayısı 4\'ün katı + 1 olmalı (ör. 41, 45, 49). Bu sayıda her sıradaki düz ilmek, bir alt sıradaki 3 tersin ortasına denk gelir ve desen kendiliğinden oturur.',
    },
    chart: ['-.---.---.---.---.---', '...-...-...-...-...-.'],
    reversible: true,
    curls: false,
    widthFactor: 0.88,
    rowFactor: 1.2,
    yarnFactor: 1.15,
    uses: ['Atkı', 'Bere', 'Boyunluk', 'Bebek yeleği'],
    tips: ['İlk iki sırada desen görünmez; 4–6 sıra sonra dikey çizgiler belirginleşir.', 'İlmek sayısı yanlışsa (4\'ün katı + 1 değilse) desen lastiğe ya da haraşoya dönüşür. İlk sırada sayını kontrol et.'],
    lessonIds: ['sis-ters-ilmek', 'sis-selanik'],
  },
  {
    id: 'selanik',
    craft: 'knit',
    name: 'Selanik',
    aka: ['Brioche', 'Patent'],
    en: 'Brioche stitch',
    level: 3,
    category: 'selanik',
    summary: 'İp atılıp kaydırılan ilmeklerle örülen kabarık, iki yüzü aynı, çok sıcak ve esnek desen. Her ilmek bir "atkı" (ip atma) ile birlikte örülür.',
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: 'Hazırlık sırası', text: '*1 ip at, 1 ilmeği ters örer gibi kaydır, 1 düz* sıra sonuna kadar tekrarla.' },
        { label: 'Selanik sırası', text: '*1 ip at, 1 ilmeği ters örer gibi kaydır, sonraki ilmeği üstündeki atılmış iple birlikte düz ör* sıra sonuna kadar tekrarla.' },
      ],
      repeat: 'Hep selanik sırasını tekrarla.',
      note: 'Çift sayıda ilmek at. Kaydırılan ilmek ile atılan ip şişte tek ilmek gibi durur; sonraki sırada ikisi birlikte örülür. Sayarken ilmek + üzerindeki ip 1 ilmek sayılır.',
    },
    round: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: '1. tur', text: '*1 ip at, 1 kaydır, 1 ilmeği atılmış ipiyle birlikte ters ör* tekrarla.' },
        { label: '2. tur', text: '*1 ilmeği atılmış ipiyle birlikte düz ör, 1 ip at, 1 kaydır* tekrarla.' },
      ],
      repeat: '1. ve 2. turları tekrarla (ilk turdan önce bir hazırlık turu: *1 ip at, 1 kaydır, 1 ters*).',
    },
    chart: ['.-.-.-.-.-.-.-.-.-.-', '.-.-.-.-.-.-.-.-.-.-'],
    chartIsApprox: true,
    reversible: true,
    curls: false,
    widthFactor: 1.05,
    rowFactor: 2,
    yarnFactor: 1.75,
    uses: ['Kalın atkı', 'Bere', 'Boyunluk', 'Kışlık hırka'],
    tips: ['Normal desenlere göre 1,5–2 kat ip harcar; ipi buna göre al.', 'Görünen her "sıra" aslında iki örülmüş sıradır.', 'Sökmek zordur. Arada bir can simidi (ilmeklerin içinden geçirilmiş ince ip) bırakmak iyi fikirdir.'],
    lessonIds: ['sis-selanik'],
  },
  /* ── Şiş: ajur ────────────────────────────────────────── */
  {
    id: 'goz-ajur',
    craft: 'knit',
    name: 'Göz ajur',
    aka: ['Delikli sıra'],
    en: 'Eyelet row',
    level: 2,
    category: 'ajur',
    summary: 'Jarse zemin üzerinde aralıklı delik sıraları. Kurdele geçirmek ya da hafif bir süs için.',
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: '1. sıra (ön yüz)', text: '1 düz, *1 ip at, 2 ilmeği birlikte düz ör* tekrarla.' },
        { label: '2. sıra (arka yüz)', text: 'Tüm ilmekleri ters ör (atılan ipler dahil).' },
        { label: '3. sıra', text: 'Tüm ilmekleri düz ör.' },
        { label: '4. sıra', text: 'Tüm ilmekleri ters ör.' },
      ],
      repeat: '1.–4. sıraları tekrarla.',
    },
    chart: ['.........', '.........', '.........', '/o/o/o/o.'],
    reversible: false,
    curls: true,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: ['Bebek giysisi kurdele yolu', 'Şal', 'Yazlık'],
    tips: ['Her ip atma 1 ilmek ekler, her "2 birlikte" 1 ilmek eksiltir; sıra sonunda sayı değişmez.'],
    lessonIds: ['sis-ip-atma', 'sis-eksiltme'],
  },
  {
    id: 'dalga-ajur',
    craft: 'knit',
    name: 'Dalga ajur',
    aka: ['Tavus kuyruğu', 'Okyanus dalgası'],
    en: 'Feather and fan',
    level: 2,
    category: 'ajur',
    summary: 'Eksiltmeler ve ip atmalar bir araya toplanarak kenarı dalgalı, yelpazeli bir kumaş oluşturur. Dört sırada bir tek desen sırası vardır.',
    flat: {
      multiple: 18,
      plus: 0,
      rows: [
        { label: '1. sıra (ön yüz)', text: 'Tüm ilmekleri düz ör.' },
        { label: '2. sıra (arka yüz)', text: 'Tüm ilmekleri ters ör.' },
        { label: '3. sıra', text: '*3 kez (2 birlikte düz), 6 kez (1 ip at, 1 düz), 3 kez (2 birlikte düz)* tekrarla.' },
        { label: '4. sıra', text: 'Tüm ilmekleri düz ör.' },
      ],
      repeat: '1.–4. sıraları tekrarla.',
      note: 'Kenarlar için iki yana 2–3 haraşo ilmek eklemek iyi olur.',
    },
    chart: ['------------------', '..................', '..................', '///.o.o.o.o.o.o///'],
    reversible: false,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: ['Şal', 'Bebek battaniyesi', 'Yazlık atkı'],
    tips: ['3. sırada ilmek sayısı değişmez: 6 eksiltme, 6 ip atma.', 'Renk değiştirmek için en güzel yer 1. sıradır.'],
    lessonIds: ['sis-ip-atma', 'sis-eksiltme'],
  },
  /* ── Şiş: burgu ───────────────────────────────────────── */
  {
    id: 'burgu-6',
    craft: 'knit',
    name: 'Klasik burgu (6 ilmek)',
    aka: ['Saç örgü', 'Halat burgu'],
    en: '3/3 cable',
    level: 3,
    category: 'burgu',
    summary: 'Ters jarse zemin üzerinde 6 ilmeklik halat. Her 8 sırada bir 3 ilmek yardımcı şişe alınıp çaprazlanır.',
    flat: {
      multiple: 8,
      plus: 2,
      rows: [
        { label: '1. ve 3. sıra (ön yüz)', text: '*2 ters, 6 düz*, 2 ters.' },
        { label: '2., 4., 6. ve 8. sıra (arka yüz)', text: '*2 düz, 6 ters*, 2 düz.' },
        { label: '5. sıra (ön yüz)', text: '*2 ters, 3/3 sağa burgu (3 ilmeği yardımcı şişe al, arkada beklet, 3 düz, yardımcıdaki 3 ilmeği düz ör)*, 2 ters.' },
        { label: '7. sıra (ön yüz)', text: '*2 ters, 6 düz*, 2 ters.' },
      ],
      repeat: '1.–8. sıraları tekrarla.',
    },
    round: {
      multiple: 8,
      plus: 0,
      rows: [
        { label: '1.–4. ve 6.–8. tur', text: '*2 ters, 6 düz* tekrarla.' },
        { label: '5. tur', text: '*2 ters, 3/3 sağa burgu* tekrarla.' },
      ],
      repeat: '1.–8. turları tekrarla.',
    },
    chart: ['--......--......--', '--......--......--', '--......--......--', '--......--......--', '--Q>>>>>--Q>>>>>--', '--......--......--', '--......--......--', '--......--......--'],
    reversible: false,
    curls: false,
    widthFactor: 0.82,
    rowFactor: 1,
    yarnFactor: 1.25,
    uses: ['Kazak', 'Bere', 'Atkı', 'Yastık'],
    tips: ['Yardımcı şiş yoksa bir bulaşık telini, kürdanı ya da kısa bir çorap şişini kullanabilirsin.', 'Arkada beklet = sağa yatan burgu, önde beklet = sola yatan burgu.'],
    lessonIds: ['sis-burgu'],
  },
  {
    id: 'burgu-4',
    craft: 'knit',
    name: 'Küçük burgu (4 ilmek)',
    en: '2/2 cable',
    level: 2,
    category: 'burgu',
    summary: 'Ters jarse zeminde 4 ilmeklik ince halat; her 4 sırada bir çaprazlanır. İlk burgu denemesi için ideal.',
    flat: {
      multiple: 6,
      plus: 2,
      rows: [
        { label: '1. sıra (ön yüz)', text: '*2 ters, 2/2 sola burgu (2 ilmeği yardımcı şişe al, önde beklet, 2 düz, yardımcıdakileri düz ör)*, 2 ters.' },
        { label: '2. ve 4. sıra (arka yüz)', text: '*2 düz, 4 ters*, 2 düz.' },
        { label: '3. sıra (ön yüz)', text: '*2 ters, 4 düz*, 2 ters.' },
      ],
      repeat: '1.–4. sıraları tekrarla.',
    },
    chart: ['--L>>>--L>>>--L>>>--', '--....--....--....--', '--....--....--....--', '--....--....--....--'],
    reversible: false,
    curls: false,
    widthFactor: 0.85,
    rowFactor: 1,
    yarnFactor: 1.2,
    uses: ['Bere', 'Bebek hırkası', 'Atkı kenarı'],
    tips: ['Sık çaprazlanan burgu daha "sıkı" görünür; 6 sırada bir çaprazlarsan daha uzun kıvrımlar elde edersin.'],
    lessonIds: ['sis-burgu'],
  },

  /* ── Tığ ──────────────────────────────────────────────── */
  {
    id: 'tig-sik-igne',
    craft: 'crochet',
    name: '{Sc} sıraları',
    en: 'Single crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: 'Sık, sağlam, neredeyse kare ilmekli kumaş. Amigurumi, sepet ve çantanın temeli.',
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: 'Temel zincir', text: 'İstenen ilmek sayısı + 1 zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 2. zincire 1 {sc}, sonraki her zincire 1 {sc}. İşi çevir.' },
        { label: '2. sıra', text: '1 zincir (dönüş zinciri, ilmek sayılmaz), ilk ilmekten başlayarak her ilmeğe 1 {sc}. İşi çevir.' },
      ],
      repeat: '2. sırayı tekrarla.',
    },
    chart: ['++++++++++c', 'c++++++++++', '++++++++++c'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: ['Amigurumi', 'Sepet', 'Bardak altlığı', 'Çanta'],
    tips: ['Sıra sonundaki son ilmeği atlamak en sık hatadır; kenarlar daralıyorsa her sıra sonunda ilmek say.'],
    lessonIds: ['tig-sik-igne', 'tig-donus'],
  },
  {
    id: 'tig-yarim-trabzan',
    craft: 'crochet',
    name: '{Hdc} sıraları',
    en: 'Half double crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: '{Sc} ile {dc} arası yükseklikte, yumuşak ve hızlı ilerleyen kumaş. Battaniye ve bereye çok uygun.',
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: 'Temel zincir', text: 'İstenen ilmek sayısı + 2 zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 3. zincire 1 {hdc}, sonraki her zincire 1 {hdc}. İşi çevir.' },
        { label: '2. sıra', text: '2 zincir (sayılmaz), her ilmeğe 1 {hdc}. İşi çevir.' },
      ],
      repeat: '2. sırayı tekrarla.',
    },
    chart: ['hhhhhhhhhcc', 'cchhhhhhhhh', 'hhhhhhhhhcc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: ['Bere', 'Battaniye', 'Atkı'],
    tips: ['{Hdc} üç halka bırakır: ön halka, arka halka ve arkada yatan üçüncü halka. Üçüncü halkaya batarak örersen ön yüzde örgü gibi yatay çizgiler oluşur.'],
    lessonIds: ['tig-yarim-trabzan'],
  },
  {
    id: 'tig-trabzan',
    craft: 'crochet',
    name: '{Dc} sıraları',
    en: 'Double crochet rows',
    level: 1,
    category: 'tig-temel',
    summary: 'Uzun ilmekli, hızlı büyüyen, yumuşak dökümlü kumaş.',
    flat: {
      multiple: 1,
      plus: 0,
      rows: [
        { label: 'Temel zincir', text: 'İstenen ilmek sayısı + 2 zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 4. zincire 1 {dc} (atlanan 3 zincir ilk ilmek sayılır), sonraki her zincire 1 {dc}. İşi çevir.' },
        { label: '2. sıra', text: '3 zincir (ilk ilmek sayılır), ilk ilmeği atla, sonraki her ilmeğe 1 {dc}, son {dc}\'yi bir önceki sıranın dönüş zincirinin tepesine ör. İşi çevir.' },
      ],
      repeat: '2. sırayı tekrarla.',
    },
    chart: ['ddddddddccc', 'cccdddddddd', 'ddddddddccc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1,
    uses: ['Şal', 'Battaniye', 'Yazlık'],
    tips: ['Dönüş zinciri sayıldığı için son ilmeği önceki sıranın dönüş zincirinin tepesine örmeyi unutma, yoksa her sıra 1 ilmek kaybedersin.'],
    lessonIds: ['tig-trabzan', 'tig-donus'],
  },
  {
    id: 'tig-kum',
    craft: 'crochet',
    name: 'Kum taneleri',
    aka: ['Tığ pirinç', 'Zincirli sık iğne'],
    en: 'Moss stitch (crochet) / Linen stitch',
    level: 2,
    category: 'tig-doku',
    summary: '{Sc} ve zincirin dönüşümlü örülmesiyle dokuma kumaş gibi düz, ince, delik vermeyen bir doku. Renk şeritleriyle çok güzel olur.',
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: 'Temel zincir', text: 'Çift sayıda zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 4. zincire 1 {sc}, *1 zincir, 1 zincir atla, sonrakine 1 {sc}* tekrarla. İşi çevir.' },
        { label: '2. sıra', text: '2 zincir, ilk zincir boşluğuna 1 {sc}, *1 zincir, sonraki zincir boşluğuna 1 {sc}* tekrarla, son {sc}\'yi dönüş zinciri boşluğuna ör. İşi çevir.' },
      ],
      repeat: '2. sırayı tekrarla.',
    },
    chart: ['+c+c+c+c+cc', 'cc+c+c+c+c+', '+c+c+c+c+cc'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.95,
    uses: ['Atkı', 'Battaniye', 'Çanta', 'Renkli şerit'],
    tips: ['İlmeklere değil, zincir boşluklarına batılır; bu yüzden saymak ve ilerlemek çok kolaydır.'],
    lessonIds: ['tig-sik-igne', 'tig-zincir'],
  },
  {
    id: 'tig-v',
    craft: 'crochet',
    name: 'V ilmek deseni',
    en: 'V-stitch',
    level: 2,
    category: 'tig-doku',
    summary: 'Aynı ilmeğe "{dc}, zincir, {dc}" örülerek oluşan V şekilleri. Hafif, havadar ve hızlı.',
    flat: {
      multiple: 3,
      plus: 2,
      rows: [
        { label: 'Temel zincir', text: '3\'ün katı + 5 zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 5. zincire (1 {dc}, 1 zincir, 1 {dc}) = V, *2 zincir atla, sonrakine V* tekrarla, 1 zincir atla, son zincire 1 {dc}. İşi çevir.' },
        { label: '2. sıra', text: '3 zincir, her V\'nin ortasındaki zincir boşluğuna 1 V, dönüş zincirinin tepesine 1 {dc}. İşi çevir.' },
      ],
      repeat: '2. sırayı tekrarla.',
    },
    chart: ['dVVVVVccc', 'cccVVVVVd'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 0.85,
    uses: ['Şal', 'Bebek battaniyesi', 'Yazlık hırka'],
    tips: ['V\'ler üst üste dizilir; sırayı V\'nin göbeğindeki zincir boşluğundan saymak kolaydır.'],
    lessonIds: ['tig-v-ilmek'],
  },
  {
    id: 'tig-yelpaze',
    craft: 'crochet',
    name: 'Yelpaze deseni',
    aka: ['Deniz kabuğu'],
    en: 'Shell stitch',
    level: 2,
    category: 'tig-doku',
    summary: 'Aynı ilmeğe 5 {dc} örülerek oluşan yelpazeler ve aralarındaki {sc}\'lerle dalgalı bir kumaş.',
    flat: {
      multiple: 6,
      plus: 1,
      rows: [
        { label: 'Temel zincir', text: '6\'nın katı + 2 zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 2. zincire 1 {sc}, *2 zincir atla, sonrakine 5 {dc} (yelpaze), 2 zincir atla, sonrakine 1 {sc}* tekrarla. İşi çevir.' },
        { label: '2. sıra', text: '3 zincir, ilk {sc}\'ye 2 {dc} (yarım yelpaze), *yelpazenin ortasındaki {dc}\'ye 1 {sc}, sonraki {sc}\'ye 5 {dc}* tekrarla, son yelpazenin ortasına 1 {sc} yerine son {sc}\'ye 3 {dc}. İşi çevir.' },
        { label: '3. sıra', text: '1 zincir, ilk ilmeğe 1 {sc}, *sonraki {sc}\'ye 5 {dc}, yelpazenin ortasına 1 {sc}* tekrarla, son {sc}\'yi dönüş zincirinin tepesine ör. İşi çevir.' },
      ],
      repeat: '2. ve 3. sıraları tekrarla.',
    },
    chart: ['+_S_+_S_+_S_+', 'd_+_S_+_S_+_d'],
    reversible: true,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1.05,
    uses: ['Battaniye', 'Şal kenarı', 'Bebek elbisesi eteği'],
    tips: ['Battaniye kenarına tek sıra yelpaze, işi bir anda bitmiş gösterir.'],
    lessonIds: ['tig-yelpaze'],
  },
  {
    id: 'tig-kabartma-lastik',
    craft: 'crochet',
    name: 'Kabartma lastik',
    en: 'Post stitch rib (FPdc / BPdc)',
    level: 3,
    category: 'tig-doku',
    summary: 'Ön ve arka kabartma {dc}\'lerin dönüşümlü örülmesiyle şiş lastiğine çok benzeyen esnek bir doku.',
    flat: {
      multiple: 2,
      plus: 0,
      rows: [
        { label: 'Temel', text: 'Çift sayıda ilmekle 1 sıra {dc} ör.' },
        { label: 'Lastik sırası', text: '2 zincir, *1 ön kabartma {dc}, 1 arka kabartma {dc}* tekrarla, dönüş zincirine 1 {hdc}. İşi çevir.' },
        { label: 'Sonraki sıralar', text: 'Önde kabarık görünen ilmeği ön kabartma, geride kalanı arka kabartma ile ör.' },
      ],
    },
    chart: ['dddddddddd', 'FKFKFKFKFK', 'FKFKFKFKFK'],
    reversible: false,
    curls: false,
    widthFactor: 0.85,
    rowFactor: 1,
    yarnFactor: 1.3,
    uses: ['Bere ağzı', 'Kol ucu', 'Battaniye kenarı'],
    tips: ['Kabartma ilmekler çok ip yer; düz {dc}\'ye göre yaklaşık %30 fazla ip ayır.'],
    lessonIds: ['tig-kabartma'],
  },
  {
    id: 'tig-fistik',
    craft: 'crochet',
    name: 'Fıstık deseni',
    en: 'Puff stitch',
    level: 2,
    category: 'tig-doku',
    summary: 'Aynı ilmekte birkaç kez ip atıp çekilen ilmeklerin tek seferde kapatılmasıyla oluşan kabarık "fıstıklar".',
    flat: {
      multiple: 2,
      plus: 1,
      rows: [
        { label: 'Temel zincir', text: 'Tek sayıda zincir çek.' },
        { label: '1. sıra', text: 'Tığdan itibaren 2. zincire {sc}, sonraki her zincire {sc}. İşi çevir.' },
        { label: '2. sıra', text: '2 zincir, *sonraki ilmeğe 1 fıstık (3 kez: ip at, bat, ipi çek; tığdaki 7 ilmekten birden geçir), 1 zincir, 1 ilmek atla* tekrarla, son ilmeğe 1 {hdc}. İşi çevir.' },
        { label: '3. sıra', text: '1 zincir, her fıstığa ve her zincir boşluğuna 1 {sc}. İşi çevir.' },
      ],
      repeat: '2. ve 3. sıraları tekrarla.',
    },
    chart: ['+++++++++++', 'ccP_P_P_P_h', '+++++++++++'],
    reversible: false,
    curls: false,
    widthFactor: 1,
    rowFactor: 1,
    yarnFactor: 1.35,
    uses: ['Battaniye', 'Bere', 'Yastık'],
    tips: ['Her çektiğin ilmeği aynı yüksekliğe kaldır; fıstığın düzgün çıkmasının sırrı budur.'],
    lessonIds: ['tig-fistik'],
  },
];

export const PATTERN_BY_ID: Record<string, StitchPattern> = Object.fromEntries(STITCH_PATTERNS.map((p) => [p.id, p]));

export const PATTERN_CATEGORY_LABEL: Record<PatternCategory, string> = {
  temel: 'Temel',
  lastik: 'Lastikler',
  doku: 'Doku',
  ajur: 'Ajur',
  burgu: 'Burgu',
  selanik: 'Selanik ailesi',
  'tig-temel': 'Tığ temel',
  'tig-doku': 'Tığ doku',
};

/** İlmek kuralını yazıya döker: "4'ün katı + 1" */
export function multipleText(w: { multiple: number; plus: number }): string {
  if (w.multiple <= 1 && w.plus === 0) return 'Her sayıda ilmek';
  const suffix: Record<number, string> = { 2: "'nin", 3: "'ün", 4: "'ün", 5: "'in", 6: "'nın", 7: "'nin", 8: "'in", 9: "'un", 10: "'un", 12: "'nin", 18: "'in" };
  const base = `${w.multiple}${suffix[w.multiple] ?? "'in"} katı`;
  if (w.multiple === 2 && w.plus === 0) return 'Çift sayı';
  if (w.multiple === 2 && w.plus === 1) return 'Tek sayı';
  return w.plus ? `${base} + ${w.plus}` : base;
}

/** Grafik satırlarını sembol dizilerine çevirir (ChartDoc sırası: üstten alta) */
export function patternChartCells(p: StitchPattern): { width: number; height: number; symbols: string[] } | null {
  if (!p.chart?.length) return null;
  const map = p.craft === 'knit' ? KNIT_CHART_CHARS : CROCHET_CHART_CHARS;
  const width = Math.max(...p.chart.map((r) => r.length));
  const topDown = [...p.chart].reverse();
  const symbols: string[] = [];
  for (const row of topDown) {
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? '';
      symbols.push(ch === '>' || ch === '_' || ch === '' ? '' : (map[ch] ?? ''));
    }
  }
  return { width, height: topDown.length, symbols };
}

/** Desen + ilmek sayısı uygun mu? */
export function fitsPattern(stitches: number, w: { multiple: number; plus: number }): boolean {
  if (w.multiple <= 1) return stitches >= Math.max(1, w.plus);
  return stitches >= w.multiple + w.plus && (stitches - w.plus) % w.multiple === 0;
}
