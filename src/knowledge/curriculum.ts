/**
 * Ders müfredatı: yollar → seviyeler → dersler.
 * Ders içerikleri (resimli adımlar) src/lessons/ altında, aynı id ile tanımlanır.
 * Diğer modüller derslere `/ders/:id` ile bağlantı verir.
 */

export type PathId = 'hazirlik' | 'sis' | 'tig';

export interface LessonMeta {
  id: string;
  path: PathId;
  title: string;
  /** tek satırlık açıklama */
  subtitle: string;
  /** tahmini süre (dk) */
  minutes: number;
}

export interface LevelMeta {
  id: string;
  path: PathId;
  /** 0: hazırlık, 1–5 */
  n: number;
  title: string;
  desc: string;
  /** ücretsiz seviye mi */
  free: boolean;
  lessons: LessonMeta[];
}

export interface PathMeta {
  id: PathId;
  title: string;
  desc: string;
  color: string;
}

export const PATHS: PathMeta[] = [
  { id: 'hazirlik', title: 'Hazırlık', desc: 'Malzemeler, ip ve numaralar, ilk düğüm', color: '#d39a2c' },
  { id: 'sis', title: 'Şiş', desc: 'Düz şiş ve misinalı şişle örgü', color: '#b5523b' },
  { id: 'tig', title: 'Tığ', desc: 'Zincirden amigurumiye tığ işi', color: '#5f7a61' },
];

const L = (path: PathId, id: string, title: string, subtitle: string, minutes = 6): LessonMeta => ({ id, path, title, subtitle, minutes });

export const LEVELS: LevelMeta[] = [
  {
    id: 'hazirlik-0',
    path: 'hazirlik',
    n: 0,
    title: 'Başlamadan önce',
    desc: 'Neye ihtiyacın var, hangi ip, hangi numara, ilk düğüm.',
    free: true,
    lessons: [
      L('hazirlik', 'haz-malzemeler', 'Örgü çantası', 'Başlamak için gereken her şey', 4),
      L('hazirlik', 'haz-ip-secimi', 'İp seçmek ve etiket okumak', 'Kalınlık, lif, metre ve gram', 5),
      L('hazirlik', 'haz-numaralar', 'Şiş ve tığ numaraları', 'Hangi iple hangi numara', 4),
      L('hazirlik', 'haz-yumak', 'Yumağı açmak', 'İç uçtan başlamak, ip dolaşmasın', 3),
      L('hazirlik', 'haz-kaygan-dugum', 'Kaygan düğüm', 'Hem şişin hem tığın ilk ilmeği', 4),
    ],
  },
  /* ── Şiş ── */
  {
    id: 'sis-1',
    path: 'sis',
    n: 1,
    title: 'İlk ilmekler',
    desc: 'Şişi tutmak, ilmek atmak, düz ilmek, ilk kumaş ve kapatma.',
    free: true,
    lessons: [
      L('sis', 'sis-tutus', 'Şişleri tutmak', 'Şiş tutuşu ve ipi parmağa almak', 5),
      L('sis', 'sis-ilmek-atma-sisle', 'Şişle ilmek atma', 'En kolay ilmek atma yöntemi', 6),
      L('sis', 'sis-ilmek-atma-basparmak', 'Başparmakla ilmek atma', 'Esnek ve düzgün kenar, sapan tutuşu', 8),
      L('sis', 'sis-duz-ilmek', 'Düz ilmek', 'Bat, sar, çek, düşür', 7),
      L('sis', 'sis-haraso', 'İlk kumaş: haraşo', 'Her sıra düz, sırayı çevirmek', 6),
      L('sis', 'sis-ilmek-kapatma', 'İlmek kapatma', 'İşi şişten güvenle almak', 6),
    ],
  },
  {
    id: 'sis-2',
    path: 'sis',
    n: 2,
    title: 'Ters ve doku',
    desc: 'Ters ilmek, jarse, lastik, pirinç ve hata düzeltme.',
    free: true,
    lessons: [
      L('sis', 'sis-ters-ilmek', 'Ters ilmek', 'İp önde, sağdan sola bat', 7),
      L('sis', 'sis-jarse', 'Jarse ve ilmek okumak', 'V ve boncuğu tanımak', 5),
      L('sis', 'sis-lastik', 'Lastik örgü', '1×1 ve 2×2, ipin önden arkaya geçişi', 6),
      L('sis', 'sis-pirinc', 'Pirinç örgü', 'Gördüğünün tersini örmek', 5),
      L('sis', 'sis-hata', 'Hataları düzeltmek', 'Geri sökmek ve kaçan ilmeği tığla toplamak', 8),
      L('sis', 'sis-uc-gizleme', 'İp eklemek, uç gizlemek', 'Yeni yumağa geçmek ve temiz bitirmek', 5),
    ],
  },
  {
    id: 'sis-3',
    path: 'sis',
    n: 3,
    title: 'Şekil vermek',
    desc: 'Artırma, eksiltme, ip atma ve ölçü örneği.',
    free: false,
    lessons: [
      L('sis', 'sis-artirma', 'Artırma', 'Önden-arkadan örme ve M1', 7),
      L('sis', 'sis-eksiltme', 'Eksiltme', '2 birlikte, kaydır-kaydır-ör, çift eksiltme', 7),
      L('sis', 'sis-ip-atma', 'İp atma ve ajur', 'Bilerek delik açmak', 6),
      L('sis', 'sis-olcu-ornegi', 'Ölçü örneği', 'Tarifin tutması için ilk kare', 6),
    ],
  },
  {
    id: 'sis-4',
    path: 'sis',
    n: 4,
    title: 'Yuvarlak örgü',
    desc: 'Misinalı şiş, magic loop, çorap şişi ve ilk bere.',
    free: false,
    lessons: [
      L('sis', 'sis-misinali', 'Misinalı şişte birleştirme', 'İlmekleri burmadan halka yapmak', 6),
      L('sis', 'sis-magic-loop', 'Magic loop', 'Uzun misinayla dar çevre örmek', 7),
      L('sis', 'sis-corap-sisi', 'Çorap şişi', 'Dört şişe dağıtıp örmek', 6),
      L('sis', 'sis-ilk-bere', 'İlk bere', 'Lastik, gövde ve tepe eksiltmesi', 15),
    ],
  },
  {
    id: 'sis-5',
    path: 'sis',
    n: 5,
    title: 'Usta işi',
    desc: 'Kaydırma, burgu, selanik, iki renk ve grafik okuma.',
    free: false,
    lessons: [
      L('sis', 'sis-kaydirma', 'İlmek kaydırma', 'Hasır örgü ve kenar ilmeği', 5),
      L('sis', 'sis-burgu', 'Burgu', 'Yardımcı şişle çaprazlamak', 9),
      L('sis', 'sis-selanik', 'Selanik ve yalancı selanik', 'İp at, kaydır, birlikte ör', 10),
      L('sis', 'sis-renkli', 'İki renkle örmek', 'Arkadan ip taşımak (fair isle)', 9),
      L('sis', 'sis-grafik-okuma', 'Grafik okumak', 'Kareli kağıttaki deseni örgüye çevirmek', 7),
    ],
  },
  /* ── Tığ ── */
  {
    id: 'tig-1',
    path: 'tig',
    n: 1,
    title: 'İlk ilmekler',
    desc: 'Tığı tutmak, zincir, kör ilmek, sık iğne ve sıra çevirmek.',
    free: true,
    lessons: [
      L('tig', 'tig-tutus', 'Tığı tutmak', 'Kalem ve bıçak tutuşu, ip gerginliği', 5),
      L('tig', 'tig-zincir', 'Zincir', 'Her tığ işinin başlangıcı', 6),
      L('tig', 'tig-kor-ilmek', 'Kör ilmek', 'Birleştirmek ve ilerlemek için', 4),
      L('tig', 'tig-sik-igne', 'Sık iğne', 'Bat, çek, iki ilmekten geçir', 7),
      L('tig', 'tig-donus', 'Sırayı çevirmek', 'Dönüş zinciri ve ilmek saymak', 6),
      L('tig', 'tig-bitirme', 'Bitirmek ve uç gizlemek', 'İpi kesip düğümlemek, ucu saklamak', 4),
    ],
  },
  {
    id: 'tig-2',
    path: 'tig',
    n: 2,
    title: 'Trabzanlar',
    desc: 'Yarım trabzandan üç ip atmalı trabzana, ön ve arka halka.',
    free: true,
    lessons: [
      L('tig', 'tig-yarim-trabzan', 'Yarım trabzan', '1 ip at, 3 ilmekten birden geçir', 6),
      L('tig', 'tig-trabzan', 'Trabzan (1 ip atma)', '2\'şer 2\'şer geçirmek', 7),
      L('tig', 'tig-trabzan-2', 'Trabzan (2 ip atma)', 'Daha uzun ilmek', 6),
      L('tig', 'tig-trabzan-3', 'Trabzan (3 ip atma)', 'En uzun ilmekler', 5),
      L('tig', 'tig-halkalar', 'Ön halka, arka halka', 'Nereye batarsan doku değişir', 5),
    ],
  },
  {
    id: 'tig-3',
    path: 'tig',
    n: 3,
    title: 'Yuvarlak ve amigurumi',
    desc: 'Sihirli halka, artırma, eksiltme, daire ve top.',
    free: false,
    lessons: [
      L('tig', 'tig-sihirli-halka', 'Sihirli halka', 'Ortası delik kalmayan başlangıç', 8),
      L('tig', 'tig-artirma', 'Artırma', 'Aynı ilmeğe iki ilmek', 4),
      L('tig', 'tig-eksiltme', 'Eksiltme', 'Görünmez eksiltme', 5),
      L('tig', 'tig-daire', 'Düz daire', '6, 12, 18… dümdüz bir daire', 7),
      L('tig', 'tig-amigurumi', 'Amigurumi top', 'Spiral örmek, doldurmak, kapatmak', 15),
    ],
  },
  {
    id: 'tig-4',
    path: 'tig',
    n: 4,
    title: 'Motif ve renk',
    desc: 'Büyükanne karesi, renk değiştirme ve birleştirme.',
    free: false,
    lessons: [
      L('tig', 'tig-buyukanne-karesi', 'Büyükanne karesi', 'Köşeler, kümeler ve boşluklar', 12),
      L('tig', 'tig-renk-degistirme', 'Renk değiştirmek', 'Son çekişte yeni renk', 5),
      L('tig', 'tig-birlestirme', 'Motifleri birleştirmek', 'Kör ilmek, sık iğne ve dikiş', 7),
    ],
  },
  {
    id: 'tig-5',
    path: 'tig',
    n: 5,
    title: 'Doku ilmekleri',
    desc: 'Fıstık, pıtırcık, yelpaze, V, kabartma, yengeç, Tunus işi.',
    free: false,
    lessons: [
      L('tig', 'tig-fistik', 'Fıstık', 'Kabarık puf ilmek', 6),
      L('tig', 'tig-pitircik', 'Pıtırcık ve patlamış mısır', 'Yarım trabzanları tepede birleştirmek', 7),
      L('tig', 'tig-yelpaze', 'Yelpaze', 'Aynı ilmeğe beş trabzan', 5),
      L('tig', 'tig-v-ilmek', 'V ilmek', 'Trabzan, zincir, trabzan', 4),
      L('tig', 'tig-kabartma', 'Kabartma trabzan', 'Gövdenin önünden ve arkasından', 7),
      L('tig', 'tig-yengec', 'Yengeç ilmeği', 'Ters yönde sık iğneyle kenar', 5),
      L('tig', 'tig-tunus', 'Tunus işi', 'Gidiş ve dönüş geçişleri', 9),
    ],
  },
];

export const ALL_LESSONS: LessonMeta[] = LEVELS.flatMap((l) => l.lessons);

export const LESSON_BY_ID: Record<string, LessonMeta> = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));

export function levelOf(lessonId: string): LevelMeta | undefined {
  return LEVELS.find((l) => l.lessons.some((x) => x.id === lessonId));
}

export function levelsFor(path: PathId): LevelMeta[] {
  return LEVELS.filter((l) => l.path === path);
}

/** Derse bağlantı (diğer modüller için) */
export const lessonHref = (id: string) => `/ders/${id}`;

/** Aynı yoldaki sonraki ders */
export function nextLesson(id: string): LessonMeta | undefined {
  const meta = LESSON_BY_ID[id];
  if (!meta) return undefined;
  const list = LEVELS.filter((l) => l.path === meta.path).flatMap((l) => l.lessons);
  const i = list.findIndex((l) => l.id === id);
  return list[i + 1];
}
