# Ortak Sepet Chrome Extension

**Ortak Sepet**, farklı e-ticaret sitelerindeki ürünleri tek bir lokal sepette toplamanızı sağlayan ücretsiz bir Chrome eklentisidir.

Eklenti, desteklenen ürün sayfalarından ürün adı, fiyat, görsel, kargo/teslimat bilgisi ve taksit/finance durumunu okuyarak ürünleri tek bir sepet arayüzünde gösterir. Sepet verileri yalnızca tarayıcınızda lokal olarak saklanır ve herhangi bir harici sunucuya gönderilmez.

## Chrome Web Store

Ortak Sepet is available on Chrome Web Store:

https://chromewebstore.google.com/detail/ortak-sepet/amknllefdhkhbffnagnnmkmjebmnbanm

## Özellikler

* Desteklenen e-ticaret sitelerinden ürün ekleme
* Türkiye ve İngiltere alışveriş siteleri için destek
* Ürün adı, fiyat, görsel, site ve ürün linki gösterme
* Kargo / teslimat bilgisi okuma
* Taksit / finance bilgisi okuma
* TL ve GBP toplamlarını ayrı ayrı hesaplama
* Genel toplam ve seçili ürün toplamı hesaplama
* Ürün adedi artırma ve azaltma
* Aynı ürün tekrar eklenirse adedi artırma
* Ürünleri otomatik kategorize etme
* Kategoriye göre gruplama ve renkli kategori ayrımı
* Taksit / finance olan ürünleri filtreleme
* Kategorileri tek butonla açma ve kapatma
* Tek butonla tüm fiyatları güncelleme
* Manuel fiyat girme
* CSV / Excel dışa aktarma
* Sağ tık menüsünden ürünü sepete ekleme
* Tarayıcı ikonunda sepetteki ürün sayısını gösterme
* Türkçe / İngilizce dil seçimi
* Karanlık mod desteği
* Verileri tarayıcıda lokal olarak saklama

## Demo

![Ortak Sepet Chrome demo](assets/screenshots/demo.gif)

## Desteklenen Siteler

### Türkiye

* Amazon Türkiye
* Hepsiburada
* Trendyol
* n11
* Teknosa
* Vatan Bilgisayar
* MediaMarkt Türkiye
* Pazarama
* Çiçeksepeti
* idefix
* D&R
* İtopya
* İncehesap

### İngiltere

* Amazon UK
* eBay UK
* Vinted UK
* Argos
* Currys
* Diesel UK

## Kullanım

1. Desteklenen bir ürün sayfasına gidin.
2. Eklenti ikonuna tıklayın.
3. Ürünü Ortak Sepet'e ekleyin.

Alternatif olarak desteklenen ürün sayfalarında sağ tık menüsündeki **“Ortak Sepet’e ekle”** seçeneğini kullanabilirsiniz.

## Not

Bu proje geliştirme aşamasındadır. Fiyat, taksit/finance, kargo ve teslimat bilgileri ürün sayfasındaki görünür bilgilerden okunur. Bazı sitelerde fiyat, kampanya, stok, kargo veya teslimat bilgileri sepette ya da ödeme adımında değişebilir. Bu nedenle satın alma öncesinde bilgiler kullanıcı tarafından kontrol edilmelidir.

## Kullanılan Teknolojiler

* JavaScript
* Chrome Extensions API
* WebExtensions
* Content Scripts
* Background Service Worker
* Context Menus
* Browser Storage
* DOM Parsing
* HTML
* CSS

## Geliştirme İçin Kurulum

1. Chrome'da `chrome://extensions/` adresine gidin.
2. Sağ üstten **Developer mode** seçeneğini açın.
3. **Load unpacked** seçeneğine tıklayın.
4. Proje klasörünü seçin.
5. Desteklenen bir ürün sayfasına gidin.
6. Eklenti popup'ından veya sağ tık menüsünden ürünü sepete ekleyin.

## Dosya Yapısı

```text
ortak-sepet-chrome/
- manifest.json
- background.js
- content.js
- content-uk.js
- popup.html
- popup.css
- popup.js
- browser-polyfill.js
- assets/
```

## Planlanan İyileştirmeler

* Daha fazla site desteği
* Parser doğruluğunu artırma
* Manuel kategori düzenleme
* JSON export / import desteği
* Stok durumu tespiti
* Daha gelişmiş fiyat değişim takibi
* Parser yapısını daha modüler hale getirme

## Marka ve Bağlantı Bildirimi

Bu proje Amazon, Hepsiburada, Trendyol, n11, Teknosa, Vatan Bilgisayar, MediaMarkt, Pazarama, Çiçeksepeti, idefix, D&R, İtopya, İncehesap, eBay, Vinted, Argos, Currys, Diesel veya listelenen diğer platformlarla bağlantılı, sponsorlu, onaylı ya da resmi bir proje değildir.

Listelenen tüm marka adları, yalnızca eklentinin hangi sitelerde çalışmayı hedeflediğini açıklamak amacıyla kullanılmıştır. Tüm marka adları ve ticari markalar ilgili sahiplerine aittir.

## Veri ve Gizlilik

Bu eklenti ürün bilgilerini kullanıcının tarayıcısında lokal olarak saklar. Ürün listesi, fiyat bilgileri veya sepet verileri herhangi bir harici sunucuya gönderilmez.

Eklenti, desteklenen ürün sayfalarındaki görünür bilgileri okumaya çalışır. Fiyat, taksit/finance, kargo ve teslimat bilgileri bazı sitelerde sepette veya ödeme adımında değişebileceğinden, bilgiler kullanıcı tarafından kontrol edilmelidir.

## Privacy Policy

Privacy policy is available here:

https://github.com/den1zalp/ortak-sepet-chrome/blob/main/PRIVACY.md
