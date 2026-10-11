# İlmek İlmek · Ana Plan

> Şiş, misinalı şiş ve tığ için **öğrenme + üretme** uygulaması. İki ayrı dünya:
> **Öğren** (resimli, adım adım dersler, desen kütüphanesi, sözlük) ve **Yarat** (eserler, tarif hazırlayıcı,
> kareli kağıt, sayaçlar, hesaplayıcılar, renk stüdyosu, ip sepeti, projeler). İkisi arasında tek dokunuşla geçilir;
> Yarat'ta bilinmeyen her teknik, ilgili dersin resimli adımlarını açar.

- **Dersler:** Hazırlık (5 ders) + Şiş yolu (5 seviye, 25 ders) + Tığ yolu (5 seviye, 26 ders) = **56 ders**. Hazırlık ve her yolun ilk iki seviyesi ücretsiz.
  Her adımda el, şiş/tığ ve ipin **nereden girip nereden çıktığı** numaralı oklar, renkli çalışan ip ve kısa döngülü animasyonla gösterilir.
- **Diller:** Türkçe, English, Español, Português. Dil değişince her şey değişir: arayüz, dersler, tarifler, semboller, birimler.
  Tığ terimleri Türkçede iki adlandırma sistemiyle (ip atma sayısına göre / İngilizceyle eşleşen), İngilizcede US ve UK olarak ayarlanır.
- **Gelir modeli:** ücretsiz katman + ucuz, tek seferlik **Usta paketi** (3–5. seviyeler). Reklam altyapısı hazır ama kapalı.
  Önce web/PWA, ardından aynı kodla Capacitor ile Android/iOS: [docs/MOBIL.md](docs/MOBIL.md).
- **Üslup:** yapay zekâ gibi duran her şey kaldırıldı: sihirbaz/parıltı simgeleri, asistan dili, emojiler, uzun tireler.
  Ses bir örgü kitabı gibi sade ve öğretici. Ayrıntılar: [docs/MIMARI.md](docs/MIMARI.md).

---

## 2. Bilgi Bankası (örgü profesörünün kafası)

### 2.1 Şiş temelleri
- **Düz (knit, k)** ve **ters (purl, p)**: tüm şiş örgüsü bu iki ilmekten doğar.
- **Haraşo** (garter): her sıra düz. Yuvarlak örgüde: 1 tur düz, 1 tur ters. Kıvrılmaz, iki yüzü aynı.
- **Jarse** (stockinette): düz sırada düz, ters sırada ters. Yuvarlakta her tur düz. **Kenarları kıvrılır** → kenara haraşo/pirinç önerilir.
- **Lastik** (rib): 1×1 (düz örgüde 2'nin katı+1 simetrik), 2×2 (4'ün katı+2), yuvarlakta 2'nin / 4'ün katı. Esner, kenara yakışır, en dar ölçüyü verir.
- **Pirinç** (seed): düz örgüde **tek sayı** ilmekle her sıra *1 düz 1 ters* → ilmekler kendiliğinden kayar. Yuvarlakta çift sayı ve her tur kaydırılır.
- **Selanik** (brioche ailesi): çift sayı ilmek, *1 ip at, 1 ilmeği örmeden kaydır, (ip atılmış ilmekle) birlikte düz ör*. İki yüzü aynı, kabarık ve sıcak, **≈1,5–2 kat ip** harcar.
- **Yalancı selanik**: **4'ün katı + 1** ilmek, *her sıra aynı*: *3 ters, 1 düz*, son ilmek ters. Selaniğe benzer ama çok daha kolay ve hızlı.
- **Burgu / saç örgü** (cable), **ajur** (ip atma + 2 birlikte), artırma (M1, kfb, ip atma), eksiltme (2 birlikte düz = sağa yatık, kaydır-kaydır-ör = sola yatık), ilmek atma (başparmak, şişle, kablo), ilmek kapatma, kenar ilmeği, kaçan ilmeği tığla kurtarma.
- **Misinalı şiş**: yuvarlak örgü, *magic loop*, çorap şişine geçme zamanı, burulmadan birleştirme.

### 2.2 Tığ temelleri
| Kanonik | Ip atma | Yükseklik | Dönüş zinciri | US | UK |
|---|---|---|---|---|---|
| Zincir | – | – | – | ch | ch |
| Kör ilmek (kaydırma) | 0 | ~0 | – | sl st | ss |
| Sık iğne | 0 | 1 | 1 (sayılmaz) | sc | dc |
| Yarım trabzan | 1 | 1,5 | 2 | hdc | htr |
| Trabzan / ikili trabzan | 1 | 2 | 3 (sayılır) | dc | tr |
| Üçlü trabzan | 2 | 3 | 4 | tr | dtr |
| Dörtlü trabzan | 3 | 4 | 5 | dtr | trtr |

> **Usta ipucu:** Türkçe kaynaklarda trabzanlar iki farklı sistemle adlandırılır.
> (A) İngilizceyle eşleşen: *yarım trabzan = hdc, ikili trabzan = dc, üçlü trabzan = tr*.
> (B) İp atma sayısına göre: *trabzan = 1 ip atma (dc), ikili = 2 ip atma (tr), üçlü = 3 ip atma (dtr)*.
> Uygulama **ayarlardan** bu sistemi seçtirir ve her yerde ip atma sayısını + US kısaltmasını da gösterir, böylece hiçbir tarif yanlış anlaşılmaz.

Diğerleri: sihirli halka, artırma (aynı ilmeğe 2), görünmez eksiltme (amigurumi), arka/ön halkadan örme, kabartma trabzan (ön/arka), fıstık (puff), patlamış mısır/pıtırcık (popcorn/bobble), yelpaze (shell), V ilmek, küme (cluster), yengeç (ters sık iğne), spiral vs. birleştirilen turlar, renk değiştirme, Tunus işi temeli.

### 2.3 İp ve alet bilgisi (CYC 0–7 standardı)
| # | Kategori | Türkçe karşılık | WPI | Şiş (mm) | Tığ (mm) | 10 cm'de ilmek (şiş) |
|---|---|---|---|---|---|---|
| 0 | Lace | Dantel / çok ince | 30–40+ | 1,5–2,25 | 1,4–2,25 | 33–40 |
| 1 | Super Fine | Çorap / bebe ince | 14–30 | 2,25–3,25 | 2,25–3,5 | 27–32 |
| 2 | Fine | Bebe / sport | 12–18 | 3,25–3,75 | 3,5–4,5 | 23–26 |
| 3 | Light | DK / ince yün | 11–15 | 3,75–4,5 | 4,5–5,5 | 21–24 |
| 4 | Medium | Orta (worsted/aran) | 9–12 | 4,5–5,5 | 5,5–6,5 | 16–20 |
| 5 | Bulky | Kalın | 6–9 | 5,5–8 | 6,5–9 | 12–15 |
| 6 | Super Bulky | Çok kalın | 5–6 | 8–12,75 | 9–15 | 7–11 |
| 7 | Jumbo | Dev / kol örgüsü | 1–4 | 12,75+ | 15+ | ≤6 |

Lif bilgisi: yün, merino, alpaka, moher, kaşmir, pamuk, keten, bambu, ipek, akrilik, polyester kadife (şönil), penye ip: sıcaklık, esneme, yıkama, hangi projeye uygun.

---

## 3. Modüller

### 3.1 Öğren ana sayfası
Ders yolları (Hazırlık, Şiş, Tığ), kaldığın yerden devam, günlük seri, seviyelere göre ders listesi, Usta paketi kilitleri.

### 3.2 Dersler, desen kütüphanesi, sözlük
- **Şiş dersleri** ve **tığ dersleri**: her derste animasyonlu gösterim (oynat/duraklat/adım adım/hız), yazılı adımlar, ipuçları, sık yapılan hatalar, kısaltmalar (TR / US / UK), grafik sembolü, nerede kullanılır.
- **Çizim motoru** (`src/engine/illust`, GIF gibi döngüsel ama adım adım kontrol edilebilir SVG):
  - *Tığ motoru*: tığdaki ilmek sayısını takip eder; "ip at → batır → çek → 2 ilmekten geçir" ilkelleriyle **her** tığ ilmeğini doğru sırayla canlandırır.
  - *Şiş motoru*: sol/sağ şiş, ilmeklerin geçişi; düz batırma, ters batırma, ip sarma, çekme, düşürme, kaydırma, ip atma.
- **Desen kütüphanesi**: haraşo, jarse, lastik, pirinç, çift pirinç, sepet, yalancı selanik, selanik, burgu, ajur, dalga…: her biri için *ilmek kuralı* ("4'ün katı + 1"), düz ve yuvarlak tarif, **örülmüş kumaş önizlemesi**.
- **Sözlük**: TR ↔ EN (US/UK) terimler, kısaltmalar, trabzan adlandırma rehberi.

### 3.3 Kareli kağıt (desen planlayıcı)
- Canvas tabanlı hızlı ızgara (200×200'e kadar), yakınlaştır/kaydır, 10'arlı kalın çizgiler: gerçek kareli kağıt gibi.
- **Oranlı hücre**: ölçü örneğinden (10 cm'de X ilmek × Y sıra) hücre en/boy oranı.
- Araçlar: kalem, silgi, kova, çizgi, dikdörtgen, damlalık, seçim (kopyala/yapıştır/çevir), **simetri** (dikey/yatay/4'lü), yazı damgası, **fotoğraftan desen** (renk sayısı azaltmalı pikselleştirme).
- Renk paleti (ip sepetinden), sembol paleti (şiş / tığ), tekrar kutusu, motif döşeme önizlemesi.
- **Yazılı tarif üretme**: düz örgüde sağ yüz sıraları sağdan sola, ters yüz sıraları soldan sağa okunur; "1. sıra (ön): A ile 4, B ile 2…"; tığ için **C2C (köşeden köşeye)** tarifi.
- **Örülmüş hâli önizleme**: her hücre V (düz) ya da boncuk (ters) olarak gerçek renginde çizilir.
- Renk başına ilmek sayısı → **metre tahmini**.
- **Takip modu**: mıknatıs cetvel, fosforlu bant, büyük +1 düğmeleri, okuma yönü oku, ekranın kapanmasını engelleme (Wake Lock).
- Dışa aktar: PNG, yazdır, JSON.

### 3.4 Sayaçlar
Sıra / ilmek / tekrar sayaçları; **bağlı sayaç** ("her 8 sırada tekrar sayacı +1"), **hatırlatıcı** ("12. sırada eksilt!"), hedef halkası, titreşim + tık sesi, klavye kısayolu (boşluk = +1), geçmiş ve hız istatistiği. Stiller: mekanik rakam, çentik, boncuk, yumak.

### 3.5 Hesaplayıcılar
1. **Kaç ilmek atmalıyım?**: ölçü örneği + istenen genişlik + desen katı (ör. 4'ün katı+2) → en yakın iki seçenek ve gerçek genişlikleri.
2. **Eşit artırma/eksiltme**: düz ve yuvarlak örgü için "*7 ör, 1 artır*" dağılımı.
3. **İp miktarı**: proje türü/ölçü/ip kalınlığına göre ya da **örnek tartma** yöntemiyle; yumak sayısı.
4. **Şiş / tığ dönüştürücü**: mm ↔ US ↔ UK.
5. **İp kalınlığı bulucu (WPI)**.
6. **Beden tabloları**: bere, çorap, kazak, bebek/çocuk/yetişkin.
7. **Tığ daire hesabı**: çap → tur sayısı.
8. **İp değiştirme**: desendeki ipin yerine benimkiyle kaç yumak?

### 3.6 Tarif hazırlayıcı ve Eserler ("ben ipimi söyleyeyim, sen tarif ver")
1. Alet seç (tığ / şiş / misinalı şiş, numarası) → 2. İp seç (sepetten veya tanımla; birden fazla renk) → 3. Proje seç → 4. Ölçüler ve desen → 5. Ölçü örneği (standart veya kendi örneğin).

**Çıktı:** malzeme listesi, gerekli metre/yumak, ölçü örneği, kısaltmalar, **işaretlenebilir adım adım tarif** (her adımın sonunda ilmek sayısı), adımlardan derslere bağlantı, gerekiyorsa yuvarlak grafik / şema, tek tıkla proje olarak kaydet.

| Tığ | Şiş / misinalı şiş |
|---|---|
| Amigurumi top (kaydırmalı artırma seçenekli) | Atkı (her desenle, kenar ilmekli) |
| Yuvarlak bardak altlığı (sık iğne / yarım trabzan / trabzan) | Bere (misinalı şiş, 8 dilim tepe eksiltmesi) |
| Büyükanne karesi (tur tur renkli) + battaniye dizilimi | Boyunluk (yuvarlak) |
| Tığ atkı | Bebek battaniyesi (kenar bordürlü) |
| Tığ bere (tepeden başlama) | Ölçü örneği |

Her üretilen tarif kendi ilmek sayılarını **matematiksel olarak doğrular** (testlerle).

**Eserler** (`/yarat`): haraşo atkı, 2×2 lastik bere, yalancı selanik atkı, burgulu bere, pirinç bulaşık bezi, ajur bebek battaniyesi, pirinç boyunluk, bebek patiği; çizgili amigurumi top, büyükanne karesi ve battaniyesi, bardak altlığı seti, tığ bere, çizgili atkı, file pazar çantası, kulaklık bandı.

### 3.7 Projelerim
Durum panosu (Fikir · Sırada · Örülüyor · Uykuda · Bitti), proje sayfası: tarif adımları, grafikler, sayaçlar, ip/alet, ölçü örneği, günlük, fotoğraflar, örgü süresi kronometresi, ilerleme.

### 3.8 İp sepeti ve alet çantası
İp kartları (marka, renk, lif, kalınlık, metre/gram, yumak, lot no), toplam metraj, **"bu iple ne örebilirim?"** → tarif hazırlayıcıya hazır doldurulmuş geçiş. Şiş/tığ envanteri.

### 3.9 Renk stüdyosu
- Palet uyumu (tamamlayıcı, komşu, üçlü) + **gri tonlama kontrast testi** (renkli örgüde değer kontrastı).
- **Şerit üretici** (rastgele / Fibonacci / geçişli) + örülmüş önizleme.
- **Sıcaklık battaniyesi** planlayıcı (aralık → renk, günlük giriş, şehir seçip geçmiş sıcaklıkları otomatik doldurma).
- **Büyükanne karesi battaniye dizici** (yan yana aynı renk gelmesin).

### 3.10 Ayarlar
Dil, tığ adlandırma sistemi (Türkçe iki sistem, İngilizce US/UK), birim (cm/inç), tema, solak modu (çizimler aynalanır), animasyon hızı, sayaç sesi/titreşim, ekranı açık tutma, yedekle/geri yükle (JSON).

---

## 4. Teknik mimari
- **Vite + React + TypeScript**, HashRouter (GitHub Pages uyumlu).
- **Zustand** + kalıcılık (localStorage), fotoğraflar **IndexedDB**.
- **PWA**: çevrimdışı çalışır, telefona "uygulama" olarak kurulur.
- Saf CSS tasarım sistemi (CSS değişkenleri, açık/koyu tema).
- Motorlar `src/engine/` altında **saf fonksiyonlar** → Vitest ile test edilir:
  `math` (ölçü, katlar, dağıtım, ip), `chart` (model, yazılı tarif, C2C, kumaş simülasyonu), `patterns` (tarif üreteçleri), `illust` (şiş/tığ/el çizimleri ve şemalar), `image` (pikselleştirme).
- Bilgi `src/knowledge/` altında veri olarak: ip kalınlıkları, şiş/tığ ölçüleri, lifler, tığ ilmekleri, şiş teknikleri, desen kütüphanesi, sözlük, semboller.
- GitHub Actions → GitHub Pages yayını.

## 5. Yol haritası
| Aşama | İçerik | Durum |
|---|---|---|
| M0 | Araştırma + plan | tamam |
| M1 | İskelet, tasarım sistemi, gezinme, veri deposu, ortak bileşenler | tamam |
| M2 | Bilgi bankası + semboller + matematik motoru (+ testler) | tamam |
| M3 | Çizim motoru, ders oynatıcısı, 56 ders, desen kütüphanesi, sözlük | tamam |
| M4 | Kareli kağıt düzenleyici, takip sayfası, yazılı tarif, kumaş önizleme, fotoğraftan grafik | tamam |
| M5 | Sayaçlar, Projelerim, İp sepeti | tamam |
| M6 | Hesaplayıcılar | tamam |
| M7 | Tarif hazırlayıcı + Eserler | tamam |
| M8 | Renk stüdyosu | tamam |
| M9 | Dört dil, iki dünya, PWA, entegrasyon, yayın iş akışı | tamam |
| M10 | Mobil uygulama (Capacitor), mağaza içi satın alma | sırada |

## 6. Kalite ölçütleri
- Her tarifteki ilmek sayıları testlerle doğrulanır (ör. büyükanne karesinde her turda 4 köşe; amigurumide 6'nın katları).
- Telefon genişliğinde (360 px) kusursuz, tek elle kullanılabilir.
- Çevrimdışı tam işlevsel; veriler cihazda kalır, yedeklenebilir.
- Türkçe dil ve örgü terminolojisi tutarlı; her tığ terimi yanında ip atma sayısı + US kısaltması.
