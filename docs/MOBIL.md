# Mobil uygulama ve gelir modeli

İlmek İlmek bugün bir web uygulaması (PWA) olarak çalışır: telefonda tarayıcıdan "Ana ekrana ekle" ile uygulama gibi kurulur,
çevrimdışı açılır, veriler cihazda kalır. Mağaza uygulaması için aynı kod **Capacitor** ile Android ve iOS kabuğuna konur.
Bu belge o adımları ve satın alma, reklam bağlantı noktalarını anlatır.

## 1. Capacitor ile paketleme

```bash
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "İlmek İlmek" com.ilmekilmek.app --web-dir dist
BASE_PATH=./ npm run build      # göreli yollarla derle
npx cap add android
npx cap add ios
npx cap sync
npx cap open android            # Android Studio
npx cap open ios                # Xcode (macOS)
```

Notlar:
- Uygulama `HashRouter` kullanır; Capacitor içinde ek yönlendirme ayarı gerekmez.
- Ekranı açık tutma (`keepAwake`) web Wake Lock API'sini kullanır. Capacitor'da `@capacitor-community/keep-awake`
  eklentisiyle `src/lib/device.ts` içindeki `keepScreenOn` işlevine bağlanır.
- Titreşim için `@capacitor/haptics`, aynı dosyadaki `vibrate` işlevine bağlanır.
- Fotoğraflar IndexedDB'de durur (`src/lib/photos.ts`); Capacitor web görünümünde aynen çalışır.
- Service worker (PWA önbelleği) mağaza uygulamasında gerekmez; `vite.config.ts` içinde `VitePWA` eklentisi
  mobil derlemede kapatılabilir.

## 2. Usta paketi (tek seferlik satın alma)

- Kilit durumu `src/store/pro.ts` içindeki `usePro` deposundadır: `pro`, `since`, `source: 'store' | 'code'`, `unlock(source)`, `lock()`.
- Hangi derslerin ücretsiz olduğu müfredatta seviye bazında `free` alanıyla belirlenir (`src/knowledge/curriculum.ts`):
  Hazırlık ve her yolun 1–2. seviyeleri ücretsiz, 3–5. seviyeler Usta paketinde.
- Mağaza bağlantısı: Google Play Billing ve App Store için bir satın alma eklentisi (ör. RevenueCat Capacitor SDK)
  eklenir. Satın alma başarılı olunca `usePro.getState().unlock('store')` çağrılır; uygulama açılışında "satın alımları geri yükle"
  aynı işlevi çağırır. Ürün kimliği önerisi: `usta_paketi` (tek seferlik, tüketilmeyen).
- Fiyat metni şimdilik `src/lib/monetization.ts` içindeki `PRO_PRICE` sabitinden gelir; mağaza eklentisi bağlanınca
  mağazanın yerel fiyatı gösterilmelidir.
- Web sürümünde satın alma düğmesi pasiftir; hediye kodu (`ILMEK-XXXX`, `checkGiftCode`) çalışır. Kod denetimi şimdilik basit
  bir sağlama toplamıdır; gerçek dağıtımda sunucu tarafı doğrulama ile değiştirilmelidir.

## 3. Reklam (isteğe bağlı)

- `ADS_ENABLED` (`src/lib/monetization.ts`) varsayılan olarak `false`. Reklam yalnızca ücretsiz katmanda, ders akışını bölmeyen
  yerlerde (ders bitişi ekranı, araç sayfalarının altı) gösterilmelidir; ders adımlarının arasına ve sayaç ekranına konmaz.
- Mobilde AdMob (`@capacitor-community/admob`), webde AdSense kullanılabilir. Usta paketi alan kullanıcıya reklam gösterilmez.

## 4. Mağaza sayfası için hazır metin (Türkçe)

**Kısa açıklama:** Şiş ve tığı resimli adımlarla öğren, kareli kağıtta desen çiz, sayaçla takip et.

**Uzun açıklama:**
İlmek İlmek, örgüye ilk ilmekten başlayanlar ve kendi modelini planlayanlar için bir atölye.
Öğren bölümünde 56 resimli ders var: ilmek atmadan burguya, zincirden amigurumiye. Her adımda ipin nereden girip
nereden çıktığı oklarla ve kısa animasyonla gösterilir. Yarat bölümünde hazır eserler, kendi ipine ve ölçüne göre
tarif hazırlayıcı, kareli kağıt desen düzenleyici, sayaçlar, hesaplayıcılar, renk stüdyosu ve ip sepeti seni bekler.
Türkçe, İngilizce, İspanyolca ve Portekizce. Tığ terimleri iki Türkçe adlandırma sistemine ve ABD/İngiltere
kullanımına göre ayarlanır.
