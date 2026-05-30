# Ortak Sepet Chrome Extension

Türkiye odaklı ortak alışveriş sepeti Chrome eklentisi.

Ortak Sepet, farklı e-ticaret sitelerindeki ürünleri tek bir sepette toplamayı, toplam fiyatı hesaplamayı, ürünleri kategorize etmeyi ve kayıtlı ürünlerin fiyatlarını tek butonla güncellemeyi amaçlayan bir tarayıcı eklentisidir.

Bu sürüm Google Chrome için hazırlanmıştır.

## Özellikler

- Desteklenen e-ticaret sitelerinden ürün ekleme
- Ürün adı, fiyat, görsel, site adı ve ürün linki gösterme
- Genel toplam ve seçili ürün toplamı hesaplama
- Ürün adedi artırma ve azaltma
- Aynı ürün tekrar eklenirse yeni kart açmak yerine adedi artırma
- Ürünleri otomatik kategorize etme
- Kategorileri tek butonla açma ve kapatma
- Taksit durumuna göre gruplama
- Tek butonla tüm kayıtlı ürün fiyatlarını güncelleme
- Fiyat yanlış okunursa manuel fiyat düzenleme
- Kargo ve teslimat bilgisini ürün sayfasından okumaya çalışma
- Taksit bilgisini ürün sayfasındaki görünür bilgilerden okumaya çalışma
- Sepet verilerini tarayıcıda lokal olarak saklama

## Desteklenen Siteler

- Amazon Türkiye
- Hepsiburada
- Trendyol
- n11
- Teknosa
- Vatan Bilgisayar
- MediaMarkt Türkiye
- Pazarama
- Çiçeksepeti
- idefix
- D&R

## Not

Bu proje beta aşamasındadır.

Fiyat, taksit, kargo ve teslimat bilgileri ürün sayfasındaki görünür bilgilerden okunur. Bazı sitelerde kargo, indirim, taksit veya teslimat bilgileri sepette ya da ödeme adımında değişebilir. Bu nedenle bilgiler kullanıcı tarafından kontrol edilmelidir.

Bu proje listelenen marka, şirket veya platformlarla bağlantılı, sponsorlu, onaylı ya da resmi bir proje değildir. Marka adları yalnızca eklentinin hangi sitelerde çalışmayı hedeflediğini açıklamak amacıyla kullanılmıştır. Tüm marka adları ve ticari markalar ilgili sahiplerine aittir.

## Kullanılan Teknolojiler

- JavaScript
- Chrome Extensions Manifest V3
- Content Scripts
- Background Service Worker
- Chrome Extension Storage
- DOM Parsing
- webextension-polyfill

## Geliştirme İçin Kurulum

1. Chrome'da `chrome://extensions` adresine git.
2. Sağ üstten **Developer mode** seçeneğini aç.
3. **Load unpacked** butonuna bas.
4. Bu proje klasörünü seç.
5. Desteklenen bir ürün sayfasına git.
6. Eklenti popup'ından ürünü sepete ekle.

## Dosya Yapısı

ortak-sepet-chrome/

- manifest.json
- background.js
- browser-polyfill.js
- content.js
- popup.html
- popup.css
- popup.js
- README.md
- LICENSE
- PRIVACY.md

## Chrome Manifest Notu

Bu sürüm Chrome Manifest V3 yapısına göre hazırlanmıştır.

Firefox sürümünden farklı olarak Chrome tarafında background işlemleri `background.service_worker` ile çalışır. `browser.*` API uyumluluğu için `webextension-polyfill` kullanılmaktadır.

## Veri ve Gizlilik

Bu eklenti ürün bilgilerini kullanıcının tarayıcısında lokal olarak saklar.

Saklanabilecek veriler şunlardır:

- Ürün adı
- Ürün fiyatı
- Ürün görseli
- Ürün linki
- Site adı
- Ürün adedi
- Seçili ürün durumu
- Manuel düzenlenmiş fiyat
- Kategori bilgisi
- Son fiyat güncelleme durumu

Ürün listesi, fiyat bilgileri, sepet verileri veya kişisel veriler herhangi bir harici sunucuya gönderilmez.

Detaylı gizlilik politikası için `PRIVACY.md` dosyasını inceleyebilirsiniz.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

Detaylar için `LICENSE` dosyasını inceleyebilirsiniz.

## Planlanan İyileştirmeler

- Daha fazla site testi
- Parser doğruluğunu artırma
- Manuel kategori düzenleme
- Export ve import desteği
- UI iyileştirmeleri
- Stok durumu tespiti
- Chrome Web Store yayını
