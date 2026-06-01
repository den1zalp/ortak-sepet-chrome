const CART_KEY = "ortakSepetItems";
const VIEW_MODE_KEY = "ortakSepetViewMode";

const addCurrentProductBtn = document.getElementById("addCurrentProductBtn");
const categorizeProductsBtn = document.getElementById("categorizeProductsBtn");
const installmentProductsBtn = document.getElementById(
  "installmentProductsBtn",
);
const updateAllPricesBtn = document.getElementById("updateAllPricesBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const statusEl = document.getElementById("status");
const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const selectedTotalPriceEl = document.getElementById("selectedTotalPrice");
const itemCountEl = document.getElementById("itemCount");

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

function extractNumberFromPrice(priceText) {
  if (!priceText) return null;

  let cleaned = String(priceText)
    .replace(/TL/gi, "")
    .replace(/₺/g, "")
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

function formatTRY(value) {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

function normalizeManualPriceInput(input) {
  const number = extractNumberFromPrice(input);

  if (number === null) {
    return null;
  }

  return formatTRY(number);
}

function calculateItemTotal(item) {
  const price = extractNumberFromPrice(item.price);
  const quantity = getQuantity(item);

  if (price === null) return null;

  return price * quantity;
}

function calculateTotal(items) {
  const total = items.reduce((sum, item) => {
    const itemTotal = calculateItemTotal(item);

    if (itemTotal === null) return sum;

    return sum + itemTotal;
  }, 0);

  return formatTRY(total);
}

function calculateSelectedTotal(items) {
  const total = items.reduce((sum, item) => {
    if (!isSelected(item)) return sum;

    const itemTotal = calculateItemTotal(item);

    if (itemTotal === null) return sum;

    return sum + itemTotal;
  }, 0);

  return formatTRY(total);
}

function calculateTotalItemCount(items) {
  return items.reduce((sum, item) => sum + getQuantity(item), 0);
}

function calculateCategoryTotal(items) {
  const total = items.reduce((sum, item) => {
    const itemTotal = calculateItemTotal(item);

    if (itemTotal === null) return sum;

    return sum + itemTotal;
  }, 0);

  return formatTRY(total);
}

function getInstallmentDisplay(item) {
  if (item.installmentAvailable === true) {
    return {
      text: "Var",
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
      text: "Bilinmiyor",
      bold: false,
    };
  }

  if (installmentText.includes("yok")) {
    return {
      text: "Yok",
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
      text: item.shippingText,
      bold: isStrongShipping,
    };
  }

  if (item.freeShipping === true) {
    return {
      text: "Ücretsiz kargo",
      bold: true,
    };
  }

  if (item.shippingAvailable === true) {
    return {
      text: "Kargo/teslimat bilgisi var",
      bold: true,
    };
  }

  return {
    text: "Sepette hesaplanır",
    bold: false,
  };
}

function getItemLineTotal(item) {
  const itemTotal = calculateItemTotal(item);

  if (itemTotal === null) {
    return "Ara toplam hesaplanamadı";
  }

  return `Ara toplam: ${formatTRY(itemTotal)}`;
}

function getLastUpdateText(item) {
  if (!item.lastCheckedAt) return null;

  if (item.lastUpdateStatus === "failed") {
    return "Son güncelleme: Başarısız";
  }

  if (item.lastUpdateStatus === "manual") {
    return "Son güncelleme: Manuel";
  }

  if (item.lastUpdateStatus === "manual-kept") {
    return "Son güncelleme: Manuel korundu";
  }

  return "Son güncelleme: Başarılı";
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

function createCartItemElement(item) {
  const wrapper = document.createElement("div");
  wrapper.className = isSelected(item)
    ? "cart-item"
    : "cart-item cart-item-unselected";

  if (item.lastUpdateStatus === "failed") {
    wrapper.classList.add("cart-item-update-failed");
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
  checkbox.title = "Seçili toplama dahil et";

  const title = document.createElement("div");
  title.className = "cart-title";
  title.textContent = item.title || "Ürün adı yok";

  titleRow.appendChild(checkbox);
  titleRow.appendChild(title);

  const details = document.createElement("div");
  details.className = "product-details";

  const installmentDisplay = getInstallmentDisplay(item);
  const shippingDisplay = getShippingDisplay(item);

  details.appendChild(
    createDetailRow("Site", item.site || "Bilinmeyen site", true),
  );

  details.appendChild(
    createDetailRow("Fiyat", item.price || "Fiyat okunamadı", true),
  );

  if (item.manualPrice === true) {
    details.appendChild(createDetailRow("Kaynak", "Manuel", true));
  }

  if (item.previousPrice && item.previousPrice !== item.price) {
    details.appendChild(createDetailRow("Önceki", item.previousPrice, false));
  }

  details.appendChild(
    createDetailRow("Taksit", installmentDisplay.text, installmentDisplay.bold),
  );

  details.appendChild(
    createDetailRow("Kargo", shippingDisplay.text, shippingDisplay.bold),
  );

  const lastUpdateText = getLastUpdateText(item);

  if (lastUpdateText) {
    details.appendChild(
      createDetailRow(
        "Kontrol",
        lastUpdateText.replace("Son güncelleme: ", ""),
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
  quantityText.textContent = `Adet: ${getQuantity(item)}`;

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
  openButton.textContent = "Linke Git";
  openButton.dataset.open = item.id;

  const editPriceButton = document.createElement("button");
  editPriceButton.className = "small-button";
  editPriceButton.textContent = "Fiyat Düzenle";
  editPriceButton.dataset.editPrice = item.id;

  const removeButton = document.createElement("button");
  removeButton.className = "small-button";
  removeButton.textContent = "Sil";
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
    groups.push(["Taksit Var", withInstallment]);
  }

  if (withoutInstallment.length > 0) {
    groups.push(["Taksit Yok / Bilinmiyor", withoutInstallment]);
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

function createCategoryGroupElement(categoryName, items) {
  const group = document.createElement("section");
  group.className = "category-group";

  const header = document.createElement("div");
  header.className = "category-header";

  const title = document.createElement("h3");
  title.className = "category-title";
  title.textContent = categoryName;

  const meta = document.createElement("span");
  meta.className = "category-meta";

  const productCount = items.length;
  const quantityCount = calculateTotalItemCount(items);
  const categoryTotal = calculateCategoryTotal(items);

  meta.textContent = `${productCount} ürün • ${quantityCount} adet • ${categoryTotal}`;

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

async function renderCart() {
  const items = await getCartItems();
  const viewMode = await getViewMode();

  cartItemsEl.innerHTML = "";
  itemCountEl.textContent = String(calculateTotalItemCount(items));
  totalPriceEl.textContent = calculateTotal(items);
  selectedTotalPriceEl.textContent = calculateSelectedTotal(items);

  categorizeProductsBtn.textContent =
    viewMode === "category" ? "Kategorileri Sil" : "Ürünleri Kategorize Et";

  installmentProductsBtn.textContent =
    viewMode === "installment"
      ? "Taksit Gruplamasını Kaldır"
      : "Taksit Olanlar";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent =
      "Sepet boş. Desteklenen bir ürün sayfasına giderek ürün ekleyebilirsiniz.";
    cartItemsEl.appendChild(empty);
    return;
  }

  if (viewMode === "installment") {
    renderInstallmentGroupedCart(items);
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
  setStatus("Ürün okunuyor...");

  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeTab = tabs[0];

  if (!activeTab || !activeTab.id) {
    setStatus("Aktif sekme bulunamadı.");
    return;
  }

  try {
    const response = await browser.tabs.sendMessage(activeTab.id, {
      type: "GET_PRODUCT",
    });

    if (!response || !response.ok) {
      setStatus(response?.error || "Bu sayfadan ürün okunamadı.");
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
      } else {
        existingItem.price = response.product.price || existingItem.price;
      }

      existingItem.image = response.product.image || existingItem.image;

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

      setStatus("Bu ürün zaten vardı, adedi artırıldı ve seçili yapıldı.");
      await renderCart();
      return;
    }

    const newItem = {
      id: createId(),
      ...response.product,
      quantity: 1,
      selected: true,
      category: categoryModeActive ? categorizeProduct(response.product) : null,
      addedAt: new Date().toISOString(),
    };

    items.push(newItem);
    await saveCartItems(items);

    setStatus("Ürün sepete eklendi.");
    await renderCart();
  } catch (error) {
    setStatus(
      "Bu sayfada eklenti çalışmıyor olabilir. Desteklenen bir ürün sayfasında dene.",
    );
  }
}

async function categorizeProducts() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus("Kategorize edilecek ürün yok.");
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
    setStatus("Kategoriler silindi.");
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

  setStatus("Ürünler kategorilere ayrıldı.");
  await renderCart();
}

async function toggleInstallmentGrouping() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus("Gruplanacak ürün yok.");
    return;
  }

  const viewMode = await getViewMode();

  if (viewMode === "installment") {
    await setViewMode("normal");
    setStatus("Taksit gruplaması kaldırıldı.");
    await renderCart();
    return;
  }

  await setViewMode("installment");
  setStatus("Ürünler taksit durumuna göre gruplandı.");
  await renderCart();
}

async function updateAllPrices() {
  const items = await getCartItems();

  if (items.length === 0) {
    setStatus("Güncellenecek ürün yok.");
    return;
  }

  updateAllPricesBtn.disabled = true;
  addCurrentProductBtn.disabled = true;
  categorizeProductsBtn.disabled = true;
  installmentProductsBtn.disabled = true;
  clearCartBtn.disabled = true;

  updateAllPricesBtn.textContent = "Güncelleniyor...";
  setStatus("Fiyatlar güncelleniyor...");

  try {
    const result = await browser.runtime.sendMessage({
      type: "UPDATE_ALL_PRICES",
    });

    await renderCart();

    if (!result || !result.ok) {
      setStatus("Fiyatlar güncellenemedi.");
      return;
    }

    setStatus(
      `Güncelleme tamamlandı. ${result.changed} ürünün fiyatı değişti, ${result.failed} ürün güncellenemedi.`,
    );
  } catch (error) {
    setStatus("Güncelleme sırasında hata oluştu.");
  } finally {
    updateAllPricesBtn.disabled = false;
    addCurrentProductBtn.disabled = false;
    categorizeProductsBtn.disabled = false;
    installmentProductsBtn.disabled = false;
    clearCartBtn.disabled = false;

    updateAllPricesBtn.textContent = "Tüm Fiyatları Güncelle";
    await renderCart();
  }
}

async function editItemPrice(id) {
  const items = await getCartItems();
  const item = items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  const currentPrice = item.price || "";
  const input = window.prompt("Yeni fiyatı gir:", currentPrice);

  if (input === null) {
    return;
  }

  const newPrice = normalizeManualPriceInput(input);

  if (!newPrice) {
    setStatus("Geçerli bir fiyat girilmedi.");
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

  setStatus("Fiyat manuel olarak güncellendi.");
  await renderCart();
}

async function removeItem(id) {
  const items = await getCartItems();
  const updatedItems = items.filter((item) => item.id !== id);

  await saveCartItems(updatedItems);
  setStatus("Ürün silindi.");
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
    setStatus("Adet 0 oldu, ürün silindi.");
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

async function clearCart() {
  await saveCartItems([]);
  await setViewMode("normal");
  setStatus("Sepet temizlendi.");
  await renderCart();
}

addCurrentProductBtn.addEventListener("click", addCurrentProduct);
categorizeProductsBtn.addEventListener("click", categorizeProducts);
installmentProductsBtn.addEventListener("click", toggleInstallmentGrouping);
updateAllPricesBtn.addEventListener("click", updateAllPrices);
clearCartBtn.addEventListener("click", clearCart);

browser.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return;

  if (message.type === "UPDATE_PRICES_PROGRESS") {
    setStatus(`Fiyatlar güncelleniyor: ${message.current}/${message.total}`);
  }

  if (message.type === "UPDATE_PRICES_DONE") {
    setStatus(
      `Güncelleme tamamlandı. ${message.changed} ürünün fiyatı değişti, ${message.failed} ürün güncellenemedi.`,
    );
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

renderCart();
