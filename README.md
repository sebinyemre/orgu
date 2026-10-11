# İlmek İlmek

Şiş, misinalı şiş ve tığ için bir örgü atölyesi. İki bölümden oluşur ve ikisi arasında tek dokunuşla geçilir:

- **Öğren**: 56 resimli, adım adım ders. Her adımda el, şiş ya da tığ ve ipin nereden girip nereden çıktığı numaralı
  oklarla ve kısa döngülü çizimlerle gösterilir. Hazırlık (malzemeler, ip seçimi, numaralar, kaygan düğüm), şiş yolu
  (ilmek atmadan burguya, selanik ve iki renkli örgüye) ve tığ yolu (zincirden Tunus işine) beş seviyede ilerler.
  Desen kütüphanesi (24 desen, ilmek kuralı, grafik, örülmüş görünüm) ve dört dilli sözlük de bu bölümdedir.
- **Yarat**: 16 hazır eser (atkı, bere, amigurumi, büyükanne karesi…), kendi aletine, ipine ve ölçüne göre adım adım
  tarif hazırlayıcı, kareli kağıt desen düzenleyici ve sıra takip sayfası, sayaçlar, dokuz hesaplayıcı, renk stüdyosu,
  ip sepeti ve proje defteri. Tarifteki bilinmeyen her teknik dokununca ilgili dersin resimli adımlarını açar.

Dil seçenekleri: **Türkçe, English, Español, Português**. Dil değişince arayüz, dersler, tarifler ve grafik metinleri
de değişir. Tığ terimleri Türkçede iki adlandırma sistemine (ip atma sayısına göre ya da İngilizceyle eşleşen),
İngilizcede ABD ve İngiltere kullanımına göre ayarlanır.

Ücretsiz katman: Hazırlık ve her yolun ilk iki seviyesi ile tüm araçlar. **Usta paketi** (tek seferlik) 3–5. seviyeleri açar.

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run build      # tip denetimi + üretim derlemesi (dist/)
```

- Vite, React 19, TypeScript (strict), zustand, react-router (HashRouter), PWA.
- Tüm veriler cihazda (localStorage ve IndexedDB); Ayarlar'dan JSON olarak yedeklenip geri yüklenir.
- Mimari, dil ve üslup kuralları: [docs/MIMARI.md](docs/MIMARI.md). Ürün planı: [PLAN.md](PLAN.md).
- Mobil uygulama (Capacitor), satın alma ve reklam bağlantıları: [docs/MOBIL.md](docs/MOBIL.md).

## Yayın

`.github/workflows/deploy.yml` her push'ta testleri çalıştırır, derler ve GitHub Pages'e yayınlar
(`BASE_PATH` depo adından alınır). İlk kullanımda depo ayarlarında **Settings → Pages → Source: GitHub Actions** seçilmelidir.

## Klasörler

| Klasör | İçerik |
|---|---|
| `src/lessons` | dersler (her ders bir dosya) |
| `src/engine/illust` | şiş, tığ, el ve şema çizimleri |
| `src/engine/patterns`, `src/content/works` | tarif üreteçleri ve hazır eserler |
| `src/engine/chart`, `src/engine/image` | grafik modeli, yazılı tarif, C2C, fotoğraftan grafik |
| `src/engine/math` | ölçü örneği, eşit dağıtım, ip miktarı |
| `src/knowledge` | ip kalınlıkları, şiş/tığ ölçüleri, lifler, terimler, semboller, desenler, müfredat |
| `src/features/*` | sayfalar |

---

**English summary.** İlmek İlmek is a knitting and crochet workshop app with two areas: *Learn* (56 illustrated,
step-by-step lessons showing exactly where the yarn goes, a stitch library and a four-language glossary) and *Create*
(ready-made patterns, a pattern maker for your own needles, yarn and size, a graph-paper chart editor with row tracking,
counters, calculators, a color studio, a yarn stash and project journal). Available in Turkish, English, Spanish and
Portuguese; crochet terms follow US or UK usage.
