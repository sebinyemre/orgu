# İlmek İlmek · Mimari ve Katkı Kılavuzu

Bu belge, uygulamaya kod yazan herkesin (insan ya da ajan) uyması gereken kuralları anlatır.

## 1. Ürün yönü
- Uygulama **iki dünyadan** oluşur, üstteki "Öğren / Yarat" düğmesiyle tek dokunuşta geçilir:
  - **Öğren** (vurgu rengi kiremit): resimli, adım adım dersler (`/`, `/ders/:id`), desen kütüphanesi (`/desenler`), sözlük (`/sozluk`).
    Dersler seviyelidir; ilk seviyeler ücretsiz, ileri seviyeler ucuz bir "Usta paketi" ile açılır.
  - **Yarat** (vurgu rengi denim): **Eserler** galerisi (`/yarat`: atkı, bere, amigurumi… seç, tarifini al), projeler,
    kareli kağıt, tarif hazırlayıcı, sayaçlar, hesaplayıcılar, renk stüdyosu, ip sepeti.
- **Yarat'ta bilinmeyen bir şey olursa yerinde gösterilir**: tarif metnindeki her teknik `TechniqueLink` ile dokunulabilir;
  dokununca o dersin resimli adımları alttan açılır, kullanıcı tariften çıkmaz.
- Hedef platform: web (PWA) ve aynı kodla mobil uygulama (Capacitor). Her ekran **önce telefon (360 px)** için tasarlanır.

## 1.1 Dört dil (zorunlu)
Uygulama **Türkçe, İngilizce, İspanyolca ve Portekizce (Brezilya)** çalışır. Dil değişince **her şey** o dile geçer.
- Arayüz metni asla bileşene sabit yazılmaz. Her modül kendi klasöründe `i18n.ts` dosyası açar:
  `export const M = defineMessages({ tr: {...}, en: {...}, es: {...}, pt: {...} })` ve bileşende `const t = useMsgs(M)`.
  Parametreli metinler fonksiyondur: `stitches: (n: number) => \`${n} ilmek\``. Dört dilin anahtarları birebir aynı olmalı (tip denetimi zorlar).
- Ortak kelimeler (Kaydet, Vazgeç, Sil, menü adları…) için `COMMON` (`src/i18n/common.ts`) kullan.
- Bilgi verisi çok dillidir: `L10n = { tr, en, es, pt }`; seçmek için `tx(value, lang)` ya da `value[lang]`. Dil: `useLang()` / `getLang()`.
- Motor kodu (tarif, grafik metni üretimi) `lang` (ve tığ için `TermsCtx`) parametresi alır, dile göre metin üretir.
- Şiş terimleri her dilde: `KNIT_VOCAB[lang]` (`src/knowledge/terms.ts`). Portekizcede (Brezilya) düz = "meia", ters = "tricô".
- Tığ terimleri dile VE geleneğe göre değişir: Türkçede iki trabzan sistemi, İngilizcede US/UK, İspanyolca ve Portekizcede tek standart.
  Asla sabit yazma; `useTerms()` (bileşen) ya da `crochetName/crochetNameLower/fillTerms(text, ctx)` (motor) kullan.
- Sayı/tarih biçimi: `fmt()`, `fmtLength()`, `fmtDate()`, `timeAgo()` dile göre biçimler.
- Çeviri kalitesi: her dilde o dili konuşan bir örgücünün kullandığı doğal terimler (İspanyolca: punto derecho/revés, lazada, punto bobo,
  punto jersey, elástico, punto arroz, montar/cerrar puntos; Portekizce: meia/tricô, laçada, ponto liga, jersey, ribana, ponto arroz,
  montar/arrematar; İngilizce: knit/purl, yarn over, garter, stockinette, rib, seed, cast on/bind off).

## 2. Üslup: "yapay zeka gibi durmasın"
Bu kurallar kesindir:
- **Asistan dili yok.** Uygulama birinci tekil şahısla konuşmaz ("senin için hazırladım", "yardımcı olayım" yok).
  Ses bir örgü kitabı ya da atölye hocası gibidir: kısa, emir kipinde, ikinci tekil ("İpi şişe dola.", "3 ilmek atla.").
- **Emoji yok.** Arayüz metinlerinde, bildirimlerde, başlıklarda emoji kullanılmaz.
- **Sihir/parıltı simgeleri yok.** `Sparkles`, `Wand`, `WandSparkles`, `Bot`, `Brain*`, `Stars`, `Zap` gibi "yapay zeka"
  çağrıştıran ikonlar ve "sihirbaz", "akıllı", "yapay zeka", "otomatik oluşturuldu" gibi ifadeler kullanılmaz.
  (İstisna: "sihirli halka" gerçek bir tığ terimidir.)
- **Uzun tire (—) kullanma.** Arayüz metninde virgül, nokta ya da iki nokta kullan.
- Abartılı ünlemler, pazarlama dili ("Mükemmel!", "Harika bir seçim!") yok. Övgü gerekiyorsa sade: "Tamamlandı."
- Mor-mavi gradyanlar, parlak "AI" kartları yok. Görsel dil: krem kağıt, kraft, washi bant, teyel çizgisi, ip renkleri.

## 3. Klasör sahipliği
| Klasör | Sahibi |
|---|---|
| `src/styles`, `src/ui`, `src/store`, `src/layout`, `src/lib`, `src/types.ts`, `src/routes.tsx` | Ortak (salt okunur) |
| `src/knowledge/*` (mevcut dosyalar), `src/engine/math`, `src/engine/counters.ts`, `src/engine/chart/draw.ts` | Ortak (salt okunur) |
| `src/i18n` | Ortak (salt okunur) |
| `src/features/learn`, `src/features/library`, `src/features/tools`, `src/lessons`, `src/engine/illust` | Dersler |
| `src/features/works`, `src/content/works` | Eserler galerisi |
| `src/features/chart`, `src/engine/chart/*` (draw.ts hariç), `src/engine/image` | Kareli kağıt |
| `src/features/projects`, `src/features/counters`, `src/features/stash` | Projeler, sayaçlar, ip sepeti |
| `src/features/recipe`, `src/engine/patterns` | Tarif hazırlayıcı |
| `src/features/calculators`, `src/features/colors` | Hesaplayıcılar, renk stüdyosu |

Ortak dosyada değişiklik gerekiyorsa kendi klasöründe yardımcı yaz, ya da değişikliği raporunda öner.

## 4. Teknik kurallar
- **React 19 + TypeScript (strict)**, Vite, HashRouter. Yeni paket kurma.
- **Durum**: `zustand` depoları `src/store/` altında (`useSettings`, `useStash`, `useProjects`, `useCharts`, `useQuickCounters`, `toast`).
  Modüle özel kalıcı durum gerekiyorsa kendi klasöründe `persist` ile ve `ilmek.` önekli anahtarla yeni depo aç.
- **Tipler**: `src/types.ts` sözleşmedir (Yarn, Tool, Counter, Project, GeneratedPattern, ChartDoc, Settings…).
- **Saf motor kodu** `src/engine/**` altında, React'e bağımlı olmadan; `*.test.ts` ile Vitest testleri yazılır.
- **Stil**: `src/styles/tokens.css` belirteçleri ve `components.css` sınıfları (`page`, `page-header`, `card`, `btn`, `btn-primary`,
  `btn-soft`, `btn-ghost`, `chip`, `field`, `input`, `select`, `seg`, `tabs`, `stepper`, `callout`, `table`, `progress`, `stat`, `list`,
  `steps`, `empty`, `tape`, `swatch`, `grid-2/3/4`, `stack`, `row`, `spread`…). Sabit renk yazma; `var(--…)` kullan
  (ip renkleri gibi veri renkleri hariç). Koyu tema belirteçlerle kendiliğinden çalışmalı.
  Modüle özel CSS: kendi klasöründe `*.css` dosyası, sınıf adlarını modül önekiyle yaz (ör. `.chart-…`).
- **Ortak bileşenler** (`src/ui`): `PageHeader`, `Modal`, `confirmDialog`, `Segmented`, `Tabs`, `Field`, `NumberInput`
  (Türkçe virgüllü ondalık), `Stepper`, `Switch`, `YarnBall`, `ProgressRing`, `Callout` (tone: info, tip, warn, danger, prof),
  `EmptyState`, `Tape`, `Term` + `useTerms`, `ColorPicker`, `SymbolGlyph`, `Logo`.
- **İkonlar**: `lucide-react` (bölüm 2'deki yasaklı ikonlar hariç).
- **Sayılar**: `fmt()`, `fmtLength()`, `fmtMeters()` (`src/lib/format.ts`). Girişte `NumberInput`.
- **Tığ terimleri**: trabzan adları kullanıcının sistemine göre değişir. Asla "trabzan", "ikili trabzan" gibi adları sabit yazma;
  `useTerms()` (bileşende) ya da `crochetName/crochetNameLower/fillTerms(text, conv)` (motorda, `conv` parametresiyle) kullan.
  Metin şablonlarında `{sc} {hdc} {dc} {tr} {dtr}` yer tutucuları, cümle başında `{Sc} {Dc}`.
- **Derslere bağlantı**: `lessonHref(id)` ve `src/knowledge/curriculum.ts` içindeki ders kimlikleri; başlık için `lessonTitle(meta, ctx)`.
- **Teknik bağlantısı**: tarif ve eser metinlerinde teknik adları `<TechniqueLink lessonId="...">metin</TechniqueLink>`
  (`src/features/learn/TechniqueLink.tsx`) ile sarılır.
- **Tarif metninde teknik**: `PatternStep.text` içinde `[[dersId|görünen metin]]` ya da `[[dersId]]` yazılır;
  `PatternView` bunu `TechniqueLink`'e çevirir. Ör. `"Sihirli halka içine 6 {sc} ör"` yerine üretici `"[[tig-sihirli-halka|Sihirli halka]] içine 6 sık iğne ör"` yazar.
- **Salt okunur grafik ve kumaş önizlemesi**: `ChartView` ve `FabricPreview` (`src/features/chart/`), props sözleşmeleri dosyalarda.
- **Tarif görünümü**: `PatternView` (`src/features/recipe/PatternView.tsx`, props: `pattern`, `doneSteps`, `onToggleStep`, `compact`).
- **Sembol stili**: grafik sembolleri CYC ya da Japon JIS stiliyle çizilebilir (`glyphOf`, `drawSymbol(..., { style })`, `<SymbolGlyph style>`).
- **Bilgi verisi**: `yarnWeights.ts` (CYC 0–7), `tools.ts` (şiş/tığ ölçüleri), `fibers.ts`, `terms.ts`, `symbols.ts`,
  `stitchPatterns.ts` (desen kuralları: `multiple`, `plus`, düz ve yuvarlak talimatlar), `curriculum.ts`, `swatches.ts`.
- **Matematik**: `src/engine/math/gauge.ts` (`castOnFor`, `nearestMultiple`, `lcm`, `rowsFor`, `cellAspect`…),
  `distribute.ts` (eşit artırma/eksiltme), `yarn.ts` (ip miktarı).
- **Erişilebilirlik**: tüm düğmelerde görünür metin ya da `aria-label`; dokunma hedefi en az 40 px; klavye ile kullanılabilir.

## 5. Doğrulama
- Tip kontrolü: `npx tsc -b --noEmit`
- Testler: `npx vitest run`
- Görsel kontrol: geliştirme sunucusu `http://localhost:5173` adresinde çalışır. Ekran görüntüsü için
  `node <scratchpad>/shot.cjs <klasör> <genişlik> <yükseklik> <url>` betiği kullanılabilir (390×844 telefon, 1280×800 masaüstü).
  İlk açılış penceresini atlamak için ortam değişkeni:
  `SETUP_JS="localStorage.setItem('ilmek.ayarlar', JSON.stringify({state:{onboarded:true,trabzan:'ipatma',units:'cm',theme:'auto',leftHanded:false,counterSound:true,counterVibrate:true,keepAwake:true,showEnglish:true,animSpeed:1},version:1}))"`
