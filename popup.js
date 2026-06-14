const CART_KEY = "ortakSepetItems";
const VIEW_MODE_KEY = "ortakSepetViewMode";
const COMPACT_MODE_KEY = "ortakSepetCompactMode";
const LANGUAGE_KEY = "ortakSepetLanguage";
const THEME_KEY = "ortakSepetTheme";

const addCurrentProductBtn = document.getElementById("addCurrentProductBtn");
const categorizeProductsBtn = document.getElementById("categorizeProductsBtn");
const installmentProductsBtn = document.getElementById(
  "installmentProductsBtn",
);
const updateAllPricesBtn = document.getElementById("updateAllPricesBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const compactViewBtn = document.getElementById("compactViewBtn");
const countryGroupingBtn = document.getElementById("countryGroupingBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const statusEl = document.getElementById("status");
const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const selectedTotalPriceEl = document.getElementById("selectedTotalPrice");
const itemCountEl = document.getElementById("itemCount");
const languageSelect = document.getElementById("languageSelect");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const appSubtitleEl = document.getElementById("appSubtitle");
const languageLabelEl = document.getElementById("languageLabel");
const itemCountLabelEl = document.getElementById("itemCountLabel");
const totalPriceLabelEl = document.getElementById("totalPriceLabel");
const selectedTotalPriceLabelEl = document.getElementById("selectedTotalPriceLabel");
const cartTitleEl = document.getElementById("cartTitle");

const I18N = {
  tr: {
    appSubtitle: "Alışverişte ortak sepetiniz",
    language: "Dil",
    enableDarkMode: "Karanlık Mod",
    enableLightMode: "Aydınlık Mod",
    addCurrentProduct: "Bu Ürünü Ekle",
    categorizeProducts: "Ürünleri Kategorize Et",
    removeCategories: "Kategorileri Sil",
    installmentProducts: "Taksit / Finance Olanlar",
    removeInstallmentGrouping: "Taksit/Finance Gruplamasını Kaldır",
    updateAllPrices: "Tüm Fiyatları Güncelle",
    updating: "Güncelleniyor...",
    exportCsv: "CSV / Excel Olarak Dışa Aktar",
    compactView: "Kompakt Görünüm",
    normalView: "Normal Görünüm",
    countryGrouping: "Ülkeye Göre Grupla",
    removeCountryGrouping: "Ülke Gruplamasını Kaldır",
    clearCart: "Sepeti Temizle",
    itemCount: "Ürün sayısı",
    total: "Genel toplam",
    selectedTotal: "Seçili toplam",
    cart: "Sepet",
    emptyCart: "Sepet boş. Desteklenen bir ürün sayfasına giderek ürün ekleyebilirsiniz.",
    selectedTotalTitle: "Seçili toplama dahil et",
    noProductTitle: "Ürün adı yok",
    unknownSite: "Bilinmeyen site",
    priceReadFailed: "Fiyat okunamadı",
    priceUnavailable: "Ana fiyat yok",
    stockStatus: "Durum",
    noActiveOffer: "Satışta değil / satın alma seçeneklerinde",
    subtotalNotIncluded: "Ara toplam: Toplama dahil edilmedi",
    productAddedWithoutPrice: "Ürün eklendi, ancak ana satış fiyatı bulunamadı. Fiyat toplama dahil edilmedi.",
    site: "Site",
    price: "Fiyat",
    source: "Kaynak",
    manual: "Manuel",
    previous: "Önceki",
    installment: "Taksit",
    finance: "Finansman",
    delivery: "Kargo",
    check: "Kontrol",
    available: "Var",
    unavailable: "Yok",
    unknown: "Bilinmiyor",
    freeDelivery: "Ücretsiz kargo",
    deliveryInfoAvailable: "Kargo/teslimat bilgisi var",
    calculatedAtCheckout: "Sepette hesaplanır",
    subtotalUnavailable: "Ara toplam hesaplanamadı",
    subtotal: "Ara toplam: {total}",
    lastFailed: "Başarısız",
    lastManual: "Manuel",
    lastManualKept: "Manuel korundu",
    lastUnavailable: "Ana fiyat yok",
    lastSuccess: "Başarılı",
    quantity: "Adet: {quantity}",
    goToLink: "Linke Git",
    manualPrice: "Manuel Fiyat Gir",
    remove: "Sil",
    installmentAvailableGroup: "Taksit / Finance Var",
    installmentUnavailableGroup: "Taksit / Finance Yok / Bilinmiyor",
    productMeta: "{products} ürün • {quantity} adet • {total}",
    countryTurkey: "Türkiye",
    countryUnitedKingdom: "İngiltere",
    groupedByCountry: "Ürünler ülkeye göre gruplandı.",
    countryGroupingRemoved: "Ülke gruplaması kaldırıldı.",
    readingProduct: "Ürün okunuyor...",
    activeTabMissing: "Aktif sekme bulunamadı.",
    productReadFailed: "Bu sayfadan ürün okunamadı.",
    unsupportedPage: "Bu sayfada eklenti çalışmıyor olabilir. Desteklenen bir ürün sayfasında dene.",
    duplicateAdded: "Bu ürün zaten vardı, adedi artırıldı ve seçili yapıldı.",
    productAdded: "Ürün sepete eklendi.",
    noItemsToCategorize: "Kategorize edilecek ürün yok.",
    categoriesRemoved: "Kategoriler silindi.",
    categoriesApplied: "Ürünler kategorilere ayrıldı.",
    noItemsToGroup: "Gruplanacak ürün yok.",
    groupingRemoved: "Taksit/finance gruplaması kaldırıldı.",
    groupedByPayment: "Ürünler taksit/finance durumuna göre gruplandı.",
    noItemsToUpdate: "Güncellenecek ürün yok.",
    pricesUpdating: "Fiyatlar güncelleniyor...",
    pricesUpdatingProgress: "Fiyatlar güncelleniyor: {current}/{total}",
    pricesUpdateFailed: "Fiyatlar güncellenemedi.",
    pricesUpdateDone: "Güncelleme tamamlandı. {changed} ürünün fiyatı değişti, {failed} ürün güncellenemedi.",
    pricesUpdateError: "Güncelleme sırasında hata oluştu.",
    promptNewPrice: "Yeni fiyatı gir:",
    invalidPrice: "Geçerli bir fiyat girilmedi.",
    manualPriceUpdated: "Fiyat manuel olarak güncellendi.",
    productRemoved: "Ürün silindi.",
    quantityZeroRemoved: "Adet 0 oldu, ürün silindi.",
    csvNoItems: "Dışa aktarılacak ürün yok.",
    csvExported: "Sepet CSV olarak dışa aktarıldı. Excel ile açabilirsiniz.",
    cartCleared: "Sepet temizlendi.",
    yes: "Evet",
    no: "Hayır",
    csvProductName: "Ürün Adı",
    csvSite: "Site",
    csvPrice: "Fiyat",
    csvQuantity: "Adet",
    csvSubtotal: "Ara Toplam",
    csvCurrency: "Para Birimi",
    csvCategory: "Kategori",
    csvPaymentPlan: "Taksit / Finance",
    csvDelivery: "Kargo / Teslimat",
    csvManualPrice: "Manuel Fiyat",
    csvUrl: "URL",
  },
  en: {
    appSubtitle: "Your shared shopping basket",
    language: "Language",
    enableDarkMode: "Dark Mode",
    enableLightMode: "Light Mode",
    addCurrentProduct: "Add This Product",
    categorizeProducts: "Categorise Products",
    removeCategories: "Remove Categories",
    installmentProducts: "With Instalments / Finance",
    removeInstallmentGrouping: "Remove Instalment / Finance Grouping",
    updateAllPrices: "Refresh All Prices",
    updating: "Updating...",
    exportCsv: "Export as CSV / Excel",
    compactView: "Compact View",
    normalView: "Normal View",
    countryGrouping: "Group by Country",
    removeCountryGrouping: "Remove Country Grouping",
    clearCart: "Clear Basket",
    itemCount: "Item count",
    total: "Total",
    selectedTotal: "Selected total",
    cart: "Basket",
    emptyCart: "Your basket is empty. Open a supported product page to add an item.",
    selectedTotalTitle: "Include in selected total",
    noProductTitle: "No product title",
    unknownSite: "Unknown site",
    priceReadFailed: "Price could not be read",
    priceUnavailable: "No main price",
    stockStatus: "Status",
    noActiveOffer: "Unavailable / buying options only",
    subtotalNotIncluded: "Subtotal: Not included in total",
    productAddedWithoutPrice: "Product added, but the main selling price was not available. It was not included in totals.",
    site: "Site",
    price: "Price",
    source: "Source",
    manual: "Manual",
    previous: "Previous",
    installment: "Instalments",
    finance: "Finance",
    delivery: "Delivery",
    check: "Check",
    available: "Available",
    unavailable: "Unavailable",
    unknown: "Unknown",
    freeDelivery: "Free delivery",
    deliveryInfoAvailable: "Delivery information available",
    calculatedAtCheckout: "Calculated at checkout",
    subtotalUnavailable: "Subtotal could not be calculated",
    subtotal: "Subtotal: {total}",
    lastFailed: "Failed",
    lastManual: "Manual",
    lastManualKept: "Manual kept",
    lastUnavailable: "No main price",
    lastSuccess: "Successful",
    quantity: "Qty: {quantity}",
    goToLink: "Open Link",
    manualPrice: "Enter Manual Price",
    remove: "Remove",
    installmentAvailableGroup: "Instalments / Finance Available",
    installmentUnavailableGroup: "No Instalments / Finance / Unknown",
    productMeta: "{products} products • {quantity} items • {total}",
    countryTurkey: "Türkiye",
    countryUnitedKingdom: "United Kingdom",
    groupedByCountry: "Products grouped by country.",
    countryGroupingRemoved: "Country grouping removed.",
    readingProduct: "Reading product...",
    activeTabMissing: "Active tab could not be found.",
    productReadFailed: "Product could not be read from this page.",
    unsupportedPage: "The extension may not work on this page. Try a supported product page.",
    duplicateAdded: "This product was already in the basket, so its quantity was increased and selected.",
    productAdded: "Product added to basket.",
    noItemsToCategorize: "There are no products to categorise.",
    categoriesRemoved: "Categories removed.",
    categoriesApplied: "Products categorised.",
    noItemsToGroup: "There are no products to group.",
    groupingRemoved: "Instalment/finance grouping removed.",
    groupedByPayment: "Products grouped by instalment/finance availability.",
    noItemsToUpdate: "There are no products to refresh.",
    pricesUpdating: "Refreshing prices...",
    pricesUpdatingProgress: "Refreshing prices: {current}/{total}",
    pricesUpdateFailed: "Prices could not be refreshed.",
    pricesUpdateDone: "Refresh complete. {changed} product prices changed, {failed} products could not be refreshed.",
    pricesUpdateError: "An error occurred while refreshing prices.",
    promptNewPrice: "Enter a new price:",
    invalidPrice: "A valid price was not entered.",
    manualPriceUpdated: "Price updated manually.",
    productRemoved: "Product removed.",
    quantityZeroRemoved: "Quantity reached 0, product removed.",
    csvNoItems: "There are no products to export.",
    csvExported: "Basket exported as CSV. You can open it with Excel.",
    cartCleared: "Basket cleared.",
    yes: "Yes",
    no: "No",
    csvProductName: "Product Name",
    csvSite: "Site",
    csvPrice: "Price",
    csvQuantity: "Quantity",
    csvSubtotal: "Subtotal",
    csvCurrency: "Currency",
    csvCategory: "Category",
    csvPaymentPlan: "Instalments / Finance",
    csvDelivery: "Delivery",
    csvManualPrice: "Manual Price",
    csvUrl: "URL",
  },
};

const CATEGORY_LABELS = {
  en: {
    "Anne & Bebek": "Mother & Baby",
    "İçecek": "Drinks",
    "Elektronik": "Electronics",
    "Telefon & Aksesuar": "Phone & Accessories",
    "Bilgisayar": "Computers",
    "Ev & Yaşam": "Home & Living",
    "Kişisel Bakım": "Personal Care",
    "Giyim": "Clothing",
    "Kitap & Kırtasiye": "Books & Stationery",
    "Market": "Groceries",
    "Oyuncak": "Toys",
    "Otomotiv": "Automotive",
    "Diğer": "Other",
  },
};

let currentLanguage = "tr";
let currentTheme = "light";

function translate(key, values = {}) {
  const dictionary = I18N[currentLanguage] || I18N.tr;
  let text = dictionary[key] || I18N.tr[key] || key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

function translateCategory(categoryName) {
  return CATEGORY_LABELS[currentLanguage]?.[categoryName] || categoryName;
}

function getPaymentLabel(item) {
  if (currentLanguage === "tr") {
    return translate("installment");
  }

  return item.region === "UK" || getItemCurrency(item) === "GBP"
    ? translate("finance")
    : translate("installment");
}

function normalizeDeliveryText(text) {
  const normalized = normalizeForCategory(text);

  if (
    normalized.includes("ucretsiz kargo") ||
    normalized.includes("kargo bedava") ||
    normalized.includes("bedava kargo") ||
    normalized.includes("ucretsiz teslimat") ||
    normalized.includes("ucretsiz teslim") ||
    normalized.includes("free delivery") ||
    normalized.includes("free shipping")
  ) {
    return translate("freeDelivery");
  }

  if (
    normalized.includes("stoktan kargo") ||
    normalized.includes("ships from stock")
  ) {
    return currentLanguage === "en" ? "Ships from stock" : "Stoktan kargo";
  }

  if (
    normalized.includes("hizli gonderi") ||
    normalized.includes("fast delivery")
  ) {
    return currentLanguage === "en" ? "Fast delivery" : "Hızlı gönderi";
  }

  if (
    normalized.includes("ayni gun kargo") ||
    normalized.includes("same day dispatch") ||
    normalized.includes("same-day dispatch")
  ) {
    return currentLanguage === "en" ? "Same-day dispatch" : "Aynı gün kargo";
  }

  if (
    normalized.includes("sepette hesaplan") ||
    normalized.includes("calculated at checkout")
  ) {
    return translate("calculatedAtCheckout");
  }

  return text;
}

async function getLanguage() {
  const result = await browser.storage.local.get(LANGUAGE_KEY);
  return result[LANGUAGE_KEY] || "tr";
}

async function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "tr";
  await browser.storage.local.set({ [LANGUAGE_KEY]: currentLanguage });
}

async function getTheme() {
  const result = await browser.storage.local.get(THEME_KEY);
  return result[THEME_KEY] === "dark" ? "dark" : "light";
}

async function setTheme(theme) {
  currentTheme = theme === "dark" ? "dark" : "light";
  await browser.storage.local.set({ [THEME_KEY]: currentTheme });
}

function applyTheme() {
  const isDark = currentTheme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggleBtn.classList.toggle("is-dark", isDark);
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? translate("enableLightMode") : translate("enableDarkMode"),
  );
  themeToggleBtn.title = isDark
    ? translate("enableLightMode")
    : translate("enableDarkMode");
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage;
  appSubtitleEl.textContent = translate("appSubtitle");
  languageLabelEl.textContent = translate("language");
  addCurrentProductBtn.textContent = translate("addCurrentProduct");
  updateAllPricesBtn.textContent = translate("updateAllPrices");
  exportCsvBtn.textContent = translate("exportCsv");
  clearCartBtn.textContent = translate("clearCart");
  itemCountLabelEl.textContent = translate("itemCount");
  totalPriceLabelEl.textContent = translate("total");
  selectedTotalPriceLabelEl.textContent = translate("selectedTotal");
  cartTitleEl.textContent = translate("cart");
  languageSelect.value = currentLanguage;
  applyTheme();
}


async function getCartItems() {
  const result = await browser.storage.local.get(CART_KEY);
  return result[CART_KEY] || [];
}

async function saveCartItems(items) {
  await browser.storage.local.set({
    [CART_KEY]: items,
  });
}

async function getViewMode() {
  const result = await browser.storage.local.get(VIEW_MODE_KEY);
  return result[VIEW_MODE_KEY] || "normal";
}

async function setViewMode(mode) {
  await browser.storage.local.set({
    [VIEW_MODE_KEY]: mode,
  });
}

async function getCompactMode() {
  const result = await browser.storage.local.get(COMPACT_MODE_KEY);
  return result[COMPACT_MODE_KEY] === true;
}

async function setCompactMode(isCompact) {
  await browser.storage.local.set({
    [COMPACT_MODE_KEY]: Boolean(isCompact),
  });
}

function applyCompactMode(isCompact) {
  document.body.classList.toggle("compact-mode", Boolean(isCompact));
  if (compactViewBtn) {
    compactViewBtn.classList.toggle("is-active", Boolean(isCompact));
    compactViewBtn.textContent = isCompact
      ? translate("normalView")
      : translate("compactView");
  }
}

function getItemRegion(item) {
  if (item.region === "UK" || getItemCurrency(item) === "GBP") {
    return "UK";
  }

  return "TR";
}

function getRegionLabel(region) {
  return region === "UK"
    ? translate("countryUnitedKingdom")
    : translate("countryTurkey");
}

function setStatus(message) {
  statusEl.textContent = message;
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getQuantity(item) {
  return item.quantity && item.quantity > 0 ? item.quantity : 1;
}

function isSelected(item) {
  return item.selected !== false;
}

function normalizeForCategory(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesKeyword(text, keyword) {
  const normalizedKeyword = normalizeForCategory(keyword);

  if (!normalizedKeyword) return false;

  const isShortKeyword = normalizedKeyword.length <= 3;
  const isSingleWord = !normalizedKeyword.includes(" ");

  if (isShortKeyword && isSingleWord) {
    const regex = new RegExp(
      `(^|[^a-z0-9])${escapeRegex(normalizedKeyword)}($|[^a-z0-9])`,
      "i",
    );

    return regex.test(text);
  }

  return text.includes(normalizedKeyword);
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => includesKeyword(text, keyword));
}

function categorizeProduct(item) {
  const text = normalizeForCategory(`${item.title || ""} ${item.site || ""}`);

  const rules = [
    {
      category: "Anne & Bebek",
      keywords: [
        "bebek",
        "mama",
        "devam sutu",
        "bebelac",
        "aptamil",
        "sma",
        "bez",
        "islak mendil",
        "emzik",
        "biberon",
        "oyuncak bebek",
      ],
    },
    {
      category: "İçecek",
      keywords: [
        "red bull",
        "enerji icecegi",
        "icecek",
        "kola",
        "gazoz",
        "su",
        "soda",
        "kahve",
        "cay",
        "meyve suyu",
      ],
    },
    {
      category: "Elektronik",
      keywords: [
        "usb",
        "bellek",
        "ssd",
        "hdd",
        "harddisk",
        "kulaklik",
        "mouse",
        "klavye",
        "monitor",
        "laptop",
        "notebook",
        "tablet",
        "kamera",
        "sandisk",
        "kingston",
        "samsung",
        "logitech",
        "anker",
        "powerbank",
        "sarj",
        "şarj",
        "adaptör",
        "adapter",
        "kablo",
        "hdmi",
        "galaxy tab",
      ],
    },
    {
      category: "Telefon & Aksesuar",
      keywords: [
        "iphone",
        "android",
        "telefon",
        "kilif",
        "kılıf",
        "ekran koruyucu",
        "spigen",
        "magsafe",
        "airpods",
        "watch",
        "akilli saat",
        "akıllı saat",
      ],
    },
    {
      category: "Bilgisayar",
      keywords: [
        "islemci",
        "işlemci",
        "anakart",
        "ram",
        "ekran karti",
        "ekran kartı",
        "ryzen",
        "intel",
        "nvidia",
        "amd",
        "rtx",
        "ddr5",
        "psu",
        "kasa",
        "fan",
        "sogutucu",
        "soğutucu",
      ],
    },
    {
      category: "Ev & Yaşam",
      keywords: [
        "ev",
        "mutfak",
        "banyo",
        "koltuk",
        "masa",
        "sandalye",
        "hali",
        "halı",
        "lamba",
        "nevresim",
        "yastik",
        "yastık",
        "dekorasyon",
        "supurge",
        "süpürge",
        "tencere",
        "tabak",
        "bardak",
        "dik y sarjli supurge",
        "dik süpürge",
        "kablolu supurge",
        "kablosuz supurge",
        "powercyclone",
      ],
    },
    {
      category: "Kişisel Bakım",
      keywords: [
        "sampuan",
        "şampuan",
        "parfum",
        "parfüm",
        "deodorant",
        "dis macunu",
        "diş macunu",
        "tirnak",
        "tırnak",
        "sac",
        "saç",
        "cilt",
        "krem",
        "tras",
        "tıraş",
        "tiras",
        "makyaj",
        "kozmetik",
      ],
    },
    {
      category: "Giyim",
      keywords: [
        "tisort",
        "tişört",
        "gomlek",
        "gömlek",
        "pantolon",
        "ayakkabi",
        "ayakkabı",
        "mont",
        "ceket",
        "elbise",
        "kazak",
        "sweatshirt",
        "corap",
        "çorap",
      ],
    },
    {
      category: "Kitap & Kırtasiye",
      keywords: [
        "kitap",
        "roman",
        "defter",
        "kalem",
        "kirtasiye",
        "kırtasiye",
        "ajanda",
        "silgi",
        "dosya",
      ],
    },
    {
      category: "Market",
      keywords: [
        "gida",
        "gıda",
        "makarna",
        "pirinc",
        "pirinç",
        "un",
        "seker",
        "şeker",
        "cikolata",
        "çikolata",
        "biskuvi",
        "bisküvi",
        "cips",
        "sut",
        "süt",
        "peynir",
        "zeytin",
        "yag",
        "yağ",
        "temizlik",
      ],
    },
    {
      category: "Oyuncak",
      keywords: [
        "oyuncak",
        "lego",
        "puzzle",
        "pelus",
        "peluş",
        "figür",
        "figur",
        "araba oyuncak",
      ],
    },
    {
      category: "Otomotiv",
      keywords: [
        "araba",
        "oto",
        "otomobil",
        "lastik",
        "motor yagi",
        "motor yağı",
        "silecek",
        "akü",
        "aku",
        "jant",
      ],
    },
  ];

  const matchedRule = rules.find((rule) => includesAny(text, rule.keywords));

  return matchedRule ? matchedRule.category : "Diğer";
}

function detectCurrencyFromPrice(priceText) {
  const text = String(priceText || "");

  if (/£|GBP/i.test(text)) {
    return "GBP";
  }

  return "TRY";
}

function extractNumberFromPrice(priceText) {
  if (!priceText) return null;

  let cleaned = String(priceText)
    .replace(/TL|TRY|GBP/gi, "")
    .replace(/[₺£]/g, "")
    .replace(/\s/g, "")
    .trim();

  const commaIndex = cleaned.lastIndexOf(",");
  const dotIndex = cleaned.lastIndexOf(".");

  if (commaIndex !== -1 && dotIndex !== -1) {
    if (commaIndex > dotIndex) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (commaIndex !== -1) {
    cleaned = cleaned.replace(",", ".");
  } else if (dotIndex !== -1) {
    const parts = cleaned.split(".");

    const allGroupsAfterFirstAreThreeDigits =
      parts.length > 1 && parts.slice(1).every((part) => part.length === 3);

    if (allGroupsAfterFirstAreThreeDigits) {
      cleaned = cleaned.replace(/\./g, "");
    }
  }

  const number = Number.parseFloat(cleaned);
  return Number.isNaN(number) ? null : number;
}

function formatPriceByCurrency(value, currency = "TRY") {
  if (currency === "GBP") {
    return `£${value.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

function formatTRY(value) {
  return formatPriceByCurrency(value, "TRY");
}

function getItemCurrency(item) {
  return item.currency || detectCurrencyFromPrice(item.price || item.detectedPrice || "");
}

function normalizeManualPriceInput(input, item = null) {
  const number = extractNumberFromPrice(input);

  if (number === null) {
    return null;
  }

  const explicitCurrency = /£|GBP/i.test(String(input || ""))
    ? "GBP"
    : /TL|TRY|₺/i.test(String(input || ""))
      ? "TRY"
      : null;

  const currency = explicitCurrency || (item ? getItemCurrency(item) : "TRY");
  return formatPriceByCurrency(number, currency);
}

function calculateItemTotal(item) {
  const price = extractNumberFromPrice(item.price);
  const quantity = getQuantity(item);

  if (price === null) return null;

  return price * quantity;
}

function calculateTotalsByCurrency(items, selectedOnly = false) {
  const totals = new Map();

  for (const item of items) {
    if (selectedOnly && !isSelected(item)) continue;

    const itemTotal = calculateItemTotal(item);
    if (itemTotal === null) continue;

    const currency = getItemCurrency(item);
    totals.set(currency, (totals.get(currency) || 0) + itemTotal);
  }

  return totals;
}

function formatTotalsByCurrency(totals) {
  if (!totals || totals.size === 0) {
    return "0,00 TL";
  }

  const order = ["TRY", "GBP"];
  const entries = Array.from(totals.entries()).sort(([a], [b]) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return entries
    .map(([currency, value]) => formatPriceByCurrency(value, currency))
    .join(" + ");
}

function calculateTotal(items) {
  return formatTotalsByCurrency(calculateTotalsByCurrency(items));
}

function calculateSelectedTotal(items) {
  return formatTotalsByCurrency(calculateTotalsByCurrency(items, true));
}

function calculateTotalItemCount(items) {
  return items.reduce((sum, item) => sum + getQuantity(item), 0);
}

function calculateCategoryTotal(items) {
  return formatTotalsByCurrency(calculateTotalsByCurrency(items));
}

function getInstallmentDisplay(item) {
  if (item.installmentAvailable === true) {
    return {
      text: translate("available"),
      bold: true,
    };
  }

  const installmentText = String(item.installmentText || "").toLocaleLowerCase(
    "tr-TR",
  );

  if (
    installmentText.includes("bulunamadı") ||
    installmentText.includes("bulunamadi") ||
    installmentText.includes("bilgisi")
  ) {
    return {
      text: translate("unknown"),
      bold: false,
    };
  }

  if (installmentText.includes("yok")) {
    return {
      text: translate("unavailable"),
      bold: false,
    };
  }

  return {
    text: "Bilinmiyor",
    bold: false,
  };
}

function getShippingDisplay(item) {
  if (item.shippingText) {
    const isStrongShipping =
      item.freeShipping === true || item.shippingAvailable === true;

    return {
      text: normalizeDeliveryText(item.shippingText),
      bold: isStrongShipping,
    };
  }

  if (item.freeShipping === true) {
    return {
      text: translate("freeDelivery"),
      bold: true,
    };
  }

  if (item.shippingAvailable === true) {
    return {
      text: translate("deliveryInfoAvailable"),
      bold: true,
    };
  }

  return {
    text: translate("calculatedAtCheckout"),
    bold: false,
  };
}

function hasUnavailableMainPrice(item) {
  return (
    item?.priceReadStatus === "unavailable" ||
    item?.priceUnavailableReason === "noActiveOffer" ||
    item?.stockAvailable === false
  );
}

function getPriceDisplayText(item) {
  if (item.price) return item.price;
  if (hasUnavailableMainPrice(item)) return translate("priceUnavailable");
  return translate("priceReadFailed");
}

function getStockDisplayText(item) {
  if (!hasUnavailableMainPrice(item)) return null;
  return translate("noActiveOffer");
}

function getItemLineTotal(item) {
  const itemTotal = calculateItemTotal(item);

  if (itemTotal === null) {
    return hasUnavailableMainPrice(item)
      ? translate("subtotalNotIncluded")
      : translate("subtotalUnavailable");
  }

  return translate("subtotal", { total: formatPriceByCurrency(itemTotal, getItemCurrency(item)) });
}

function getLastUpdateText(item) {
  if (!item.lastCheckedAt) return null;

  if (item.lastUpdateStatus === "failed") {
    return translate("lastFailed");
  }

  if (item.lastUpdateStatus === "manual") {
    return translate("lastManual");
  }

  if (item.lastUpdateStatus === "manual-kept") {
    return translate("lastManualKept");
  }

  if (item.lastUpdateStatus === "unavailable") {
    return translate("lastUnavailable");
  }

  return translate("lastSuccess");
}

function truncateProductTitle(titleText, maxLength = 60) {
  const cleanedTitle = String(titleText || "").replace(/\s+/g, " ").trim();

  if (cleanedTitle.length <= maxLength) {
    return cleanedTitle;
  }

  return `${cleanedTitle.slice(0, maxLength).trim()}…`;
}

function createDetailRow(labelText, valueText, shouldBoldValue = false) {
  const row = document.createElement("div");
  row.className = "detail-row";

  const label = document.createElement("span");
  label.className = "detail-label";
  label.textContent = `${labelText}:`;

  const value = document.createElement("span");
  value.className = shouldBoldValue
    ? "detail-value detail-value-strong"
    : "detail-value";
  value.textContent = valueText;

  row.appendChild(label);
  row.appendChild(value);

  return row;
}

function getCategoryColor(categoryName) {
  const colors = {
    "Anne & Bebek": "#f9a8d4",
    "İçecek": "#38bdf8",
    "Elektronik": "#60a5fa",
    "Telefon & Aksesuar": "#818cf8",
    "Bilgisayar": "#fb923c",
    "Ev & Yaşam": "#34d399",
    "Kişisel Bakım": "#c084fc",
    "Giyim": "#f472b6",
    "Kitap & Kırtasiye": "#a78bfa",
    "Market": "#22c55e",
    "Oyuncak": "#facc15",
    "Otomotiv": "#94a3b8",
    "Taksit Var": "#22c55e",
    "Taksit / Finance Var": "#22c55e",
    "Instalments / Finance Available": "#22c55e",
    "Taksit Yok / Bilinmiyor": "#94a3b8",
    "Taksit / Finance Yok / Bilinmiyor": "#94a3b8",
    "No Instalments / Finance / Unknown": "#94a3b8",
    "Türkiye": "#ef4444",
    "İngiltere": "#2563eb",
    "United Kingdom": "#2563eb",
    "Diğer": "#d1d5db",
  };

  return colors[categoryName] || "#d1d5db";
}

function applyCategoryAccent(element, categoryName) {
  element.style.setProperty("--category-color", getCategoryColor(categoryName));
}

function createCartItemElement(item) {
  const wrapper = document.createElement("div");
  wrapper.className = isSelected(item)
    ? "cart-item"
    : "cart-item cart-item-unselected";

  if (item.lastUpdateStatus === "failed") {
    wrapper.classList.add("cart-item-update-failed");
  }

  if (item.category) {
    applyCategoryAccent(wrapper, item.category);
    wrapper.classList.add("cart-item-with-category");
  }

  const image = document.createElement("img");
  image.className = "cart-image";
  image.src = item.image || "";
  image.alt = "";

  const info = document.createElement("div");
  info.className = "cart-info";

  const titleRow = document.createElement("div");
  titleRow.className = "title-row";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "select-checkbox";
  checkbox.checked = isSelected(item);
  checkbox.dataset.toggleSelected = item.id;
  checkbox.title = translate("selectedTotalTitle");

  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";

  const title = document.createElement("div");
  title.className = "cart-title";
  const fullTitle = item.title || translate("noProductTitle");
  title.textContent = truncateProductTitle(fullTitle, 60);
  title.title = fullTitle;

  titleContainer.appendChild(title);

  if (item.category) {
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "category-badge";
    categoryBadge.textContent = translateCategory(item.category);
    applyCategoryAccent(categoryBadge, item.category);
    titleContainer.appendChild(categoryBadge);
  }

  titleRow.appendChild(checkbox);
  titleRow.appendChild(titleContainer);

  const details = document.createElement("div");
  details.className = "product-details";

  const installmentDisplay = getInstallmentDisplay(item);
  const shippingDisplay = getShippingDisplay(item);

  details.appendChild(
    createDetailRow(translate("site"), item.site || translate("unknownSite"), true),
  );

  details.appendChild(
    createDetailRow(translate("price"), getPriceDisplayText(item), Boolean(item.price)),
  );

  const stockDisplayText = getStockDisplayText(item);
  if (stockDisplayText) {
    details.appendChild(createDetailRow(translate("stockStatus"), stockDisplayText, false));
  }

  if (item.manualPrice === true) {
    details.appendChild(createDetailRow(translate("source"), translate("manual"), true));
  }

  if (item.previousPrice && item.previousPrice !== item.price) {
    details.appendChild(createDetailRow(translate("previous"), item.previousPrice, false));
  }

  details.appendChild(
    createDetailRow(getPaymentLabel(item), installmentDisplay.text, installmentDisplay.bold),
  );

  details.appendChild(
    createDetailRow(translate("delivery"), shippingDisplay.text, shippingDisplay.bold),
  );

  const lastUpdateText = getLastUpdateText(item);

  if (lastUpdateText) {
    details.appendChild(
      createDetailRow(
        translate("check"),
        lastUpdateText,
        item.lastUpdateStatus === "success" ||
          item.lastUpdateStatus === "manual" ||
          item.lastUpdateStatus === "manual-kept",
      ),
    );
  }

  const lineTotal = document.createElement("div");
  lineTotal.className = "line-total";
  lineTotal.textContent = getItemLineTotal(item);

  const quantityRow = document.createElement("div");
  quantityRow.className = "quantity-row";

  const decreaseButton = document.createElement("button");
  decreaseButton.className = "small-button quantity-button";
  decreaseButton.textContent = "-";
  decreaseButton.dataset.decrease = item.id;

  const quantityText = document.createElement("span");
  quantityText.className = "quantity-text";
  quantityText.textContent = translate("quantity", { quantity: getQuantity(item) });

  const increaseButton = document.createElement("button");
  increaseButton.className = "small-button quantity-button";
  increaseButton.textContent = "+";
  increaseButton.dataset.increase = item.id;

  quantityRow.appendChild(decreaseButton);
  quantityRow.appendChild(quantityText);
  quantityRow.appendChild(increaseButton);

  const actions = document.createElement("div");
  actions.className = "cart-actions";

  const openButton = document.createElement("button");
  openButton.className = "small-button";
  openButton.textContent = translate("goToLink");
  openButton.dataset.open = item.id;

  const editPriceButton = document.createElement("button");
  editPriceButton.className = "small-button";
  editPriceButton.textContent = translate("manualPrice");
  editPriceButton.dataset.editPrice = item.id;

  const removeButton = document.createElement("button");
  removeButton.className = "small-button";
  removeButton.textContent = translate("remove");
  removeButton.dataset.remove = item.id;

  actions.appendChild(openButton);
  actions.appendChild(editPriceButton);
  actions.appendChild(removeButton);

  info.appendChild(titleRow);
  info.appendChild(details);
  info.appendChild(lineTotal);
  info.appendChild(quantityRow);
  info.appendChild(actions);

  wrapper.appendChild(image);
  wrapper.appendChild(info);

  return wrapper;
}

function groupItemsByInstallment(items) {
  const withInstallment = [];
  const withoutInstallment = [];

  for (const item of items) {
    if (item.installmentAvailable === true) {
      withInstallment.push(item);
    } else {
      withoutInstallment.push(item);
    }
  }

  const groups = [];

  if (withInstallment.length > 0) {
    groups.push([translate("installmentAvailableGroup"), withInstallment]);
  }

  if (withoutInstallment.length > 0) {
    groups.push([translate("installmentUnavailableGroup"), withoutInstallment]);
  }

  return groups;
}

function groupItemsByCategory(items) {
  const grouped = new Map();

  for (const item of items) {
    const category = item.category || "Diğer";

    if (!grouped.has(category)) {
      grouped.set(category, []);
    }

    grouped.get(category).push(item);
  }

  return Array.from(grouped.entries()).sort(([categoryA], [categoryB]) => {
    if (categoryA === "Diğer") return 1;
    if (categoryB === "Diğer") return -1;

    return categoryA.localeCompare(categoryB, "tr-TR");
  });
}

function groupItemsByCountry(items) {
  const grouped = new Map();

  for (const item of items) {
    const region = getItemRegion(item);

    if (!grouped.has(region)) {
      grouped.set(region, []);
    }

    grouped.get(region).push(item);
  }

  const order = ["TR", "UK"];
  return Array.from(grouped.entries()).sort(([regionA], [regionB]) => {
    return order.indexOf(regionA) - order.indexOf(regionB);
  });
}

function createCategoryGroupElement(categoryName, items) {
  const group = document.createElement("section");
  group.className = "category-group";
  applyCategoryAccent(group, categoryName);

  const header = document.createElement("div");
  header.className = "category-header";

  const title = document.createElement("h3");
  title.className = "category-title";
  title.textContent = translateCategory(categoryName);

  const meta = document.createElement("span");
  meta.className = "category-meta";

  const productCount = items.length;
  const quantityCount = calculateTotalItemCount(items);
  const categoryTotal = calculateCategoryTotal(items);

  meta.textContent = translate("productMeta", { products: productCount, quantity: quantityCount, total: categoryTotal });

  header.appendChild(title);
  header.appendChild(meta);

  group.appendChild(header);

  for (const item of items) {
    const itemElement = createCartItemElement(item);
    group.appendChild(itemElement);
  }

  return group;
}

function shouldRenderCategorized(items) {
  return items.some((item) => Boolean(item.category));
}

function renderFlatCart(items) {
  for (const item of items) {
    const element = createCartItemElement(item);
    cartItemsEl.appendChild(element);
  }
}

function renderCategorizedCart(items) {
  const groupedItems = groupItemsByCategory(items);

  for (const [categoryName, categoryItems] of groupedItems) {
    const groupElement = createCategoryGroupElement(
      categoryName,
      categoryItems,
    );
    cartItemsEl.appendChild(groupElement);
  }
}

function renderInstallmentGroupedCart(items) {
  const groupedItems = groupItemsByInstallment(items);

  for (const [groupName, groupItems] of groupedItems) {
    const groupElement = createCategoryGroupElement(groupName, groupItems);
    cartItemsEl.appendChild(groupElement);
  }
}

function renderCountryGroupedCart(items) {
  const groupedItems = groupItemsByCountry(items);

  for (const [region, groupItems] of groupedItems) {
    const groupElement = createCategoryGroupElement(getRegionLabel(region), groupItems);
    cartItemsEl.appendChild(groupElement);
  }
}

async function renderCart() {
  const items = await getCartItems();
  const viewMode = await getViewMode();
  const compactMode = await getCompactMode();

  applyCompactMode(compactMode);

  cartItemsEl.innerHTML = "";
  itemCountEl.textContent = String(calculateTotalItemCount(items));
  totalPriceEl.textContent = calculateTotal(items);
  selectedTotalPriceEl.textContent = calculateSelectedTotal(items);

  categorizeProductsBtn.textContent =
    viewMode === "category" ? translate("removeCategories") : translate("categorizeProducts");

  installmentProductsBtn.textContent =
    viewMode === "installment"
      ? translate("removeInstallmentGrouping")
      : translate("installmentProducts");

  countryGroupingBtn.textContent =
    viewMode === "country"
      ? translate("removeCountryGrouping")
      : translate("countryGrouping");

  countryGroupingBtn.classList.toggle("is-active", viewMode === "country");
  categorizeProductsBtn.classList.toggle("is-active", viewMode === "category");
  installmentProductsBtn.classList.toggle("is-active", viewMode === "installment");

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = translate("emptyCart");
    cartItemsEl.appendChild(empty);
    return;
  }

  if (viewMode === "installment") {
    renderInstallmentGroupedCart(items);
    return;
  }

  if (viewMode === "country") {
    renderCountryGroupedCart(items);
    return;
  }

  if (viewMode === "category" && shouldRenderCategorized(items)) {
    renderCategorizedCart(items);
    return;
  }

  renderFlatCart(items);
}

function normalizeUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    parsedUrl.hash = "";

    const removableParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "trackingId",
      "gclid",
      "fbclid",
      "yclid",
      "ttclid",
      "msclkid",
    ];

    for (const param of removableParams) {
      parsedUrl.searchParams.delete(param);
    }

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

async function addCurrentProduct() {
  setStatus(translate("readingProduct"));

  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeTab = tabs[0];

  if (!activeTab || !activeTab.id) {
    setStatus(translate("activeTabMissing"));
    return;
  }

  try {
    const response = await browser.tabs.sendMessage(activeTab.id, {
      type: "GET_PRODUCT",
    });

    if (!response || !response.ok) {
      setStatus(response?.error || translate("productReadFailed"));
      return;
    }

    const items = await getCartItems();
    const viewMode = await getViewMode();
    const categoryModeActive = viewMode === "category";

    const currentProductUrl = normalizeUrl(response.product.url);

    const existingItem = items.find((item) => {
      return normalizeUrl(item.url) === currentProductUrl;
    });

    if (existingItem) {
      existingItem.quantity = getQuantity(existingItem) + 1;
      existingItem.selected = true;
      existingItem.title = response.product.title || existingItem.title;

      if (existingItem.manualPrice === true) {
        existingItem.detectedPrice =
          response.product.price || existingItem.detectedPrice;
      } else if (response.product.price) {
        existingItem.price = response.product.price;
      } else if (response.product.priceReadStatus === "unavailable") {
        existingItem.previousPrice = existingItem.price || existingItem.previousPrice;
        existingItem.price = null;
      }

      existingItem.priceReadStatus = response.product.priceReadStatus || existingItem.priceReadStatus || null;
      existingItem.priceUnavailableReason = response.product.priceUnavailableReason || existingItem.priceUnavailableReason || null;
      existingItem.stockAvailable = response.product.stockAvailable ?? existingItem.stockAvailable ?? null;
      existingItem.stockText = response.product.stockText || existingItem.stockText || "";

      existingItem.image = response.product.image || existingItem.image;
      existingItem.currency = response.product.currency || detectCurrencyFromPrice(existingItem.price);
      existingItem.currencySymbol = response.product.currencySymbol || (existingItem.currency === "GBP" ? "£" : "TL");
      existingItem.region = response.product.region || existingItem.region || (existingItem.currency === "GBP" ? "UK" : "TR");

      existingItem.installmentAvailable = response.product.installmentAvailable;
      existingItem.installmentText = response.product.installmentText;

      existingItem.shippingAvailable = response.product.shippingAvailable;
      existingItem.freeShipping = response.product.freeShipping;
      existingItem.shippingText = response.product.shippingText;
      existingItem.shippingSource = response.product.shippingSource;
      existingItem.shippingConfidence = response.product.shippingConfidence;

      if (categoryModeActive) {
        existingItem.category = categorizeProduct(existingItem);
      }

      existingItem.updatedAt = new Date().toISOString();

      await saveCartItems(items);

      setStatus(
        response.product.price
          ? translate("duplicateAdded")
          : translate("productAddedWithoutPrice"),
      );
      await renderCart();
      return;
    }

    const productCurrency = response.product.currency || detectCurrencyFromPrice(response.product.price);

    const newItem = {
      id: createId(),
      ...response.product,
      currency: productCurrency,
      currencySymbol: response.product.currencySymbol || (productCurrency === "GBP" ? "£" : "TL"),
      region: response.product.region || (productCurrency === "GBP" ? "UK" : "TR"),
      quantity: 1,
      selected: true,
      category: categoryModeActive ? categorizeProduct(response.product) : null,
      addedAt: new Date().toISOString(),
    };

    items.push(newItem);
    await saveCartItems(items);

    setStatus(
      response.product.price
        ? translate("productAdded")
        : translate("productAddedWithoutPrice"),
    );
    await renderCart();
  } catch (error) {
    setStatus(translate("unsupportedPage"));
  }
}

async function categorizeProducts() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus(translate("noItemsToCategorize"));
    return;
  }

  const viewMode = await getViewMode();

  if (viewMode === "category") {
    await setViewMode("normal");

    const updatedItems = items.map((item) => {
      return {
        ...item,
        category: null,
        updatedAt: new Date().toISOString(),
      };
    });

    await saveCartItems(updatedItems);
    setStatus(translate("categoriesRemoved"));
    await renderCart();
    return;
  }

  const updatedItems = items.map((item) => {
    return {
      ...item,
      category: categorizeProduct(item),
      updatedAt: new Date().toISOString(),
    };
  });

  await saveCartItems(updatedItems);
  await setViewMode("category");

  setStatus(translate("categoriesApplied"));
  await renderCart();
}

async function toggleInstallmentGrouping() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus(translate("noItemsToGroup"));
    return;
  }

  const viewMode = await getViewMode();

  if (viewMode === "installment") {
    await setViewMode("normal");
    setStatus(translate("groupingRemoved"));
    await renderCart();
    return;
  }

  await setViewMode("installment");
  setStatus(translate("groupedByPayment"));
  await renderCart();
}

async function toggleCountryGrouping() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus(translate("noItemsToGroup"));
    return;
  }

  const viewMode = await getViewMode();

  if (viewMode === "country") {
    await setViewMode("normal");
    setStatus(translate("countryGroupingRemoved"));
    await renderCart();
    return;
  }

  await setViewMode("country");
  setStatus(translate("groupedByCountry"));
  await renderCart();
}

async function toggleCompactMode() {
  const isCompact = await getCompactMode();
  await setCompactMode(!isCompact);
  applyCompactMode(!isCompact);
}

async function updateAllPrices() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus(translate("noItemsToUpdate"));
    return;
  }

  updateAllPricesBtn.disabled = true;
  addCurrentProductBtn.disabled = true;
  categorizeProductsBtn.disabled = true;
  installmentProductsBtn.disabled = true;
  clearCartBtn.disabled = true;
  exportCsvBtn.disabled = true;
  countryGroupingBtn.disabled = true;
  compactViewBtn.disabled = true;

  updateAllPricesBtn.textContent = translate("updating");
  setStatus(translate("pricesUpdating"));

  try {
    const result = await browser.runtime.sendMessage({
      type: "UPDATE_ALL_PRICES",
    });

    await renderCart();

    if (!result || !result.ok) {
      setStatus(translate("pricesUpdateFailed"));
      return;
    }

    setStatus(translate("pricesUpdateDone", { changed: result.changed, failed: result.failed }));
  } catch (error) {
    setStatus(translate("pricesUpdateError"));
  } finally {
    updateAllPricesBtn.disabled = false;
    addCurrentProductBtn.disabled = false;
    categorizeProductsBtn.disabled = false;
    installmentProductsBtn.disabled = false;
    clearCartBtn.disabled = false;
    exportCsvBtn.disabled = false;
    countryGroupingBtn.disabled = false;
    compactViewBtn.disabled = false;

    updateAllPricesBtn.textContent = translate("updateAllPrices");
    await renderCart();
  }
}

async function editItemPrice(id) {
  const items = await getCartItems();
  const item = items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  const currentPrice = item.price || "";
  const input = window.prompt(translate("promptNewPrice"), currentPrice);

  if (input === null) {
    return;
  }

  const newPrice = normalizeManualPriceInput(input, item);

  if (!newPrice) {
    setStatus(translate("invalidPrice"));
    return;
  }

  if (item.price && item.price !== newPrice) {
    item.previousPrice = item.price;
  }

  item.price = newPrice;
  item.manualPrice = true;
  item.lastUpdateStatus = "manual";
  item.lastCheckedAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();

  await saveCartItems(items);

  setStatus(translate("manualPriceUpdated"));
  await renderCart();
}

async function removeItem(id) {
  const items = await getCartItems();
  const updatedItems = items.filter((item) => item.id !== id);

  await saveCartItems(updatedItems);
  setStatus(translate("productRemoved"));
  await renderCart();
}

async function toggleSelected(id) {
  const items = await getCartItems();

  const item = items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  item.selected = !isSelected(item);
  item.updatedAt = new Date().toISOString();

  await saveCartItems(items);
  await renderCart();
}

async function increaseQuantity(id) {
  const items = await getCartItems();

  const item = items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  item.quantity = getQuantity(item) + 1;
  item.updatedAt = new Date().toISOString();

  await saveCartItems(items);
  await renderCart();
}

async function decreaseQuantity(id) {
  const items = await getCartItems();

  const item = items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  const currentQuantity = getQuantity(item);

  if (currentQuantity <= 1) {
    const updatedItems = items.filter((cartItem) => cartItem.id !== id);
    await saveCartItems(updatedItems);
    setStatus(translate("quantityZeroRemoved"));
    await renderCart();
    return;
  }

  item.quantity = currentQuantity - 1;
  item.updatedAt = new Date().toISOString();

  await saveCartItems(items);
  await renderCart();
}

async function openItem(id) {
  const items = await getCartItems();
  const item = items.find((cartItem) => cartItem.id === id);

  if (!item || !item.url) return;

  await browser.tabs.create({
    url: item.url,
  });
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function createExportFilename() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10);
  return `ortak-sepet-${datePart}.csv`;
}

function buildCsvContent(items) {
  const headers = [
    translate("csvProductName"),
    translate("csvSite"),
    translate("csvPrice"),
    translate("csvQuantity"),
    translate("csvSubtotal"),
    translate("csvCurrency"),
    translate("csvCategory"),
    translate("csvPaymentPlan"),
    translate("csvDelivery"),
    translate("csvManualPrice"),
    translate("csvUrl"),
  ];

  const rows = items.map((item) => {
    const itemTotal = calculateItemTotal(item);
    const currency = getItemCurrency(item);
    const installmentDisplay = getInstallmentDisplay(item);
    const shippingDisplay = getShippingDisplay(item);

    return [
      item.title || "",
      item.site || "",
      item.price || "",
      getQuantity(item),
      itemTotal === null ? "" : formatPriceByCurrency(itemTotal, currency),
      currency,
      item.category ? translateCategory(item.category) : "",
      installmentDisplay.text,
      shippingDisplay.text,
      item.manualPrice === true ? translate("yes") : translate("no"),
      item.url || "",
    ];
  });

  const csvLines = [headers, ...rows].map((row) => {
    return row.map(escapeCsvValue).join(",");
  });

  return `\ufeff${csvLines.join("\n")}`;
}

async function exportCartAsCsv() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus(translate("csvNoItems"));
    return;
  }

  const csvContent = buildCsvContent(items);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = createExportFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus(translate("csvExported"));
}

async function clearCart() {
  await saveCartItems([]);
  await setViewMode("normal");
  setStatus(translate("cartCleared"));
  await renderCart();
}

addCurrentProductBtn.addEventListener("click", addCurrentProduct);
categorizeProductsBtn.addEventListener("click", categorizeProducts);
installmentProductsBtn.addEventListener("click", toggleInstallmentGrouping);
updateAllPricesBtn.addEventListener("click", updateAllPrices);
exportCsvBtn.addEventListener("click", exportCartAsCsv);
countryGroupingBtn.addEventListener("click", toggleCountryGrouping);
compactViewBtn.addEventListener("click", toggleCompactMode);
clearCartBtn.addEventListener("click", clearCart);
languageSelect.addEventListener("change", async () => {
  await setLanguage(languageSelect.value);
  applyStaticTranslations();
  await renderCart();
});

themeToggleBtn.addEventListener("click", async () => {
  await setTheme(currentTheme === "dark" ? "light" : "dark");
  applyTheme();
});

browser.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return;

  if (message.type === "UPDATE_PRICES_PROGRESS") {
    setStatus(translate("pricesUpdatingProgress", { current: message.current, total: message.total }));
  }

  if (message.type === "UPDATE_PRICES_DONE") {
    setStatus(translate("pricesUpdateDone", { changed: message.changed, failed: message.failed }));
  }
});

cartItemsEl.addEventListener("click", async (event) => {
  const target = event.target;

  if (!target || !target.dataset) return;

  if (target.dataset.toggleSelected) {
    await toggleSelected(target.dataset.toggleSelected);
  }

  if (target.dataset.editPrice) {
    await editItemPrice(target.dataset.editPrice);
  }

  if (target.dataset.remove) {
    await removeItem(target.dataset.remove);
  }

  if (target.dataset.open) {
    await openItem(target.dataset.open);
  }

  if (target.dataset.increase) {
    await increaseQuantity(target.dataset.increase);
  }

  if (target.dataset.decrease) {
    await decreaseQuantity(target.dataset.decrease);
  }
});

async function initPopup() {
  currentLanguage = await getLanguage();
  currentTheme = await getTheme();
  applyStaticTranslations();
  await renderCart();
}

initPopup();
