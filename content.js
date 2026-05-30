function getText(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : "";
}

function getAttr(selector, attr) {
  const element = document.querySelector(selector);
  return element ? element.getAttribute(attr) || "" : "";
}

function cleanText(text) {
  if (!text) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

function cleanPrice(rawPrice) {
  if (!rawPrice) return null;

  const text = cleanText(rawPrice);

  const matches = text.match(
    /₺\s*\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?|\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?\s*(?:TL|₺)?|\d+(?:[.,]\d{1,2})?\s*(?:TL|₺)?/gi,
  );

  if (!matches || matches.length === 0) return null;

  const priceWithCurrency = matches.find((match) => /TL|₺/i.test(match));
  let cleaned = cleanText(priceWithCurrency || matches[0]);

  if (!/TL|₺/i.test(cleaned)) {
    cleaned = `${cleaned} TL`;
  }

  return cleaned;
}

function getSiteName() {
  const host = window.location.hostname.replace("www.", "");

  if (host.includes("trendyol")) return "Trendyol";
  if (host.includes("hepsiburada")) return "Hepsiburada";
  if (host.includes("n11")) return "n11";
  if (host.includes("amazon")) return "Amazon TR";
  if (host.includes("teknosa")) return "Teknosa";
  if (host.includes("vatanbilgisayar")) return "Vatan Bilgisayar";
  if (host.includes("mediamarkt")) return "MediaMarkt";
  if (host.includes("pazarama")) return "Pazarama";
  if (host.includes("ciceksepeti")) return "Çiçeksepeti";
  if (host.includes("idefix")) return "idefix";
  if (host.includes("dr.com.tr")) return "D&R";

  return host;
}

function isVisibleElement(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
}

function looksLikeTryPrice(text) {
  if (!text) return false;

  const clean = cleanText(text);

  return /(TL|₺)/i.test(clean) && /\d/.test(clean) && clean.length <= 70;
}

function hasChildWithPriceText(element) {
  return Array.from(element.children || []).some((child) =>
    looksLikeTryPrice(child.textContent),
  );
}

function normalizeForBasicSearch(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeInstallmentText(text) {
  return cleanText(text)
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function getNearbyText(element, depth = 3) {
  const parts = [];
  let current = element;

  for (let i = 0; i < depth && current; i++) {
    const text = cleanText(current.textContent);
    if (text && text.length <= 500) {
      parts.push(text);
    }

    current = current.parentElement;
  }

  return cleanText(parts.join(" "));
}
function findN11InstallmentInfo() {
  const rawBodyText =
    document.body?.textContent || document.documentElement?.textContent || "";

  const normalized = normalizeInstallmentText(rawBodyText);

  const paymentTabTexts = Array.from(
    document.querySelectorAll("div, section, li, span, p, button, a"),
  )
    .map((el) => cleanText(el.textContent))
    .filter(Boolean)
    .filter((text) => {
      const normalizedText = normalizeInstallmentText(text);
      return /odeme kolayliklari|taksit secenekleri|aya varan taksit|baslayan taksit|alisveris kredisi/i.test(
        normalizedText,
      );
    });

  const joinedText = normalizeInstallmentText(
    [rawBodyText, ...paymentTabTexts].join(" \n "),
  );

  if (
    /taksit secenekleri/i.test(joinedText) ||
    /\d+\s*aya?\s*varan\s*taksit/i.test(joinedText) ||
    /\d+\s*taksit/i.test(joinedText) ||
    /baslayan taksit/i.test(joinedText) ||
    /taksit firsati/i.test(joinedText)
  ) {
    return {
      installmentAvailable: true,
      installmentText: "Taksit var",
    };
  }

  if (
    /alisveris kredisi/i.test(joinedText) &&
    !/taksit secenekleri|\d+\s*taksit|aya varan taksit|baslayan taksit/i.test(
      joinedText,
    )
  ) {
    return {
      installmentAvailable: false,
      installmentText: "Taksit bilgisi bulunamadı",
    };
  }

  if (
    /taksit yok|taksit yapilamaz|taksit uygulanmaz|taksit secenegi bulunmamaktadir/i.test(
      joinedText,
    )
  ) {
    return {
      installmentAvailable: false,
      installmentText: "Taksit yok",
    };
  }

  return {
    installmentAvailable: false,
    installmentText: "Taksit bilgisi bulunamadı",
  };
}
function findInstallmentInfo() {
  const host = window.location.hostname;

  if (host.includes("n11")) {
    return findN11InstallmentInfo();
  }

  const titleElement =
    document.querySelector("[data-test-id='title']") ||
    document.querySelector("#productTitle") ||
    document.querySelector("h1");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("button, a, span, div, p, li"),
  );

  function isCardlessInstallmentText(text) {
    const normalized = normalizeInstallmentText(text);

    return /kartsiz taksit|kartsiz taksitle|kartsiz|alisveris kredisi|krediyle al|finansman|alisveris finansmani|hepsifinans|hepsi finans|kredili odeme|hepsipay/i.test(
      normalized,
    );
  }

  function isNegativeInstallmentText(text) {
    const normalized = normalizeInstallmentText(text);

    return /taksit yok|taksit yapilamaz|taksit uygulanmaz|taksit secenegi bulunmamaktadir|taksit bulunmamaktadir|kredi kartina taksit yok|kredi karti taksiti yok/i.test(
      normalized,
    );
  }

  function hasBankOrCardKeyword(text) {
    const normalized = normalizeInstallmentText(text);

    return /bonus|world|worldcard|axess|maximum|paraf|cardfinans|advantage|bankkart|kuveytturk|kuveyt turk|ziraat|is bankasi|iş bankasi|garanti|yapi kredi|yapikredi|akbank|vakifbank|halkbank|denizbank|qnb|enpara|teb|ing/i.test(
      normalized,
    );
  }

  function isExplicitRegularInstallmentText(text) {
    const normalized = normalizeInstallmentText(text);

    if (isCardlessInstallmentText(normalized)) {
      return false;
    }

    return (
      /pesin fiyatina\s*\d+\s*taksit/i.test(normalized) ||
      /pesin fiyatina\s*\d+\s*x/i.test(normalized) ||
      /\d+\s*taksit/i.test(normalized) ||
      /tl'?den baslayan taksitlerle/i.test(normalized) ||
      /den baslayan taksitlerle/i.test(normalized) ||
      /baslayan taksitlerle/i.test(normalized) ||
      /taksitlerle/i.test(normalized) ||
      (/\d+\s*x\s*[\d.,]+\s*tl/i.test(normalized) &&
        hasBankOrCardKeyword(normalized)) ||
      /kredi kartina taksit|kredi karti taksiti|kredi karti ile taksit|kartlara taksit|kartina taksit|banka kartlarina taksit|bankalara ozel taksit/i.test(
        normalized,
      ) ||
      /bonus.*taksit|world.*taksit|worldcard.*taksit|axess.*taksit|maximum.*taksit|paraf.*taksit|cardfinans.*taksit|advantage.*taksit|bankkart.*taksit/i.test(
        normalized,
      )
    );
  }

  function isWeakInstallmentText(text, contextText) {
    const normalized = normalizeInstallmentText(text);
    const normalizedContext = normalizeInstallmentText(contextText);

    if (isCardlessInstallmentText(normalizedContext)) {
      return false;
    }

    return /taksit secenekleri|taksitli odeme|taksitle ode|taksitle al/i.test(
      normalized,
    );
  }

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);

      if (!text) return false;
      if (text.length > 320) return false;

      const normalized = normalizeInstallmentText(text);

      const hasInstallmentKeyword =
        /taksit|vade|pesin fiyatina|kredi karti|kartlara|kartina|bonus|world|worldcard|axess|maximum|paraf|cardfinans|advantage|bankkart|kuveytturk|finansman|alisveris kredisi|kartsiz|hepsifinans|hepsipay|\d+\s*x\s*[\d.,]+\s*tl/i.test(
          normalized,
        );

      if (!hasInstallmentKeyword) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect && rect.top < titleRect.bottom - 70) return false;
      if (titleRect && rect.top > titleRect.bottom + 950) return false;

      return true;
    })
    .map((element) => ({
      text: cleanText(element.textContent),
      contextText: getNearbyText(element, 3),
    }));

  const negativeMatch = candidates.find((candidate) =>
    isNegativeInstallmentText(candidate.contextText),
  );

  if (negativeMatch) {
    return {
      installmentAvailable: false,
      installmentText: "Taksit yok",
    };
  }

  const explicitRegularMatch = candidates.find((candidate) =>
    isExplicitRegularInstallmentText(candidate.text),
  );

  if (explicitRegularMatch) {
    return {
      installmentAvailable: true,
      installmentText: "Taksit var",
    };
  }

  const weakRegularMatch = candidates.find((candidate) =>
    isWeakInstallmentText(candidate.text, candidate.contextText),
  );

  if (weakRegularMatch) {
    return {
      installmentAvailable: true,
      installmentText: "Taksit var",
    };
  }

  return {
    installmentAvailable: false,
    installmentText: "Taksit bilgisi bulunamadı",
  };
}

function getDefaultShippingInfoForSite() {
  const host = window.location.hostname;

  if (host.includes("amazon")) {
    return {
      shippingAvailable: false,
      freeShipping: false,
      shippingText: "Teslimat sepette/adrese göre hesaplanır",
      shippingSource: "cart",
      shippingConfidence: "site-default",
    };
  }

  if (
    host.includes("trendyol") ||
    host.includes("hepsiburada") ||
    host.includes("n11")
  ) {
    return {
      shippingAvailable: false,
      freeShipping: false,
      shippingText: "Sepette hesaplanır",
      shippingSource: "cart",
      shippingConfidence: "site-default",
    };
  }

  return {
    shippingAvailable: false,
    freeShipping: false,
    shippingText: "Sepette hesaplanır",
    shippingSource: "cart",
    shippingConfidence: "unknown",
  };
}

function findShippingInfo() {
  const host = window.location.hostname;

  function normalizeForSearch(text) {
    return cleanText(text)
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");
  }

  function analyzeShippingText(text) {
    const normalized = normalizeForSearch(text);

    const freeShippingRegex =
      /ucretsiz kargo|kargo bedava|bedava kargo|ucretsiz teslimat|teslimat ucretsiz|ucretsiz gonderim|kargo ucretsiz|kargosu bedava/i;

    const paidShippingRegex =
      /kargo ucreti|kargo bedeli|teslimat ucreti|teslimat bedeli|ucretli kargo|nakliye ucreti/i;

    const genericShippingRegex =
      /kargo|teslimat|gonderim|kapinda|kargoya verilir|kargoda|bugun kargoda|yarin kapinda|hizli teslimat|teslim tarihi/i;

    if (freeShippingRegex.test(normalized)) {
      return {
        shippingAvailable: true,
        freeShipping: true,
        shippingText: host.includes("amazon")
          ? "Ücretsiz teslimat"
          : "Ücretsiz kargo",
        shippingSource: "product-page",
        shippingConfidence: "explicit",
      };
    }

    if (paidShippingRegex.test(normalized)) {
      return {
        shippingAvailable: true,
        freeShipping: false,
        shippingText: "Kargo ücretli olabilir",
        shippingSource: "product-page",
        shippingConfidence: "explicit",
      };
    }

    if (genericShippingRegex.test(normalized)) {
      return {
        shippingAvailable: true,
        freeShipping: false,
        shippingText: host.includes("amazon")
          ? "Teslimat bilgisi var"
          : "Kargo/teslimat bilgisi var",
        shippingSource: "product-page",
        shippingConfidence: "generic",
      };
    }

    return null;
  }

  function shouldUseResult(result) {
    if (!result) return false;
    if (result.freeShipping) return true;
    if (result.shippingText === "Kargo ücretli olabilir") return true;

    if (
      host.includes("trendyol") ||
      host.includes("hepsiburada") ||
      host.includes("n11")
    ) {
      return false;
    }

    return true;
  }

  function collectTextFromElement(element) {
    const texts = [];

    const textContent = cleanText(element.textContent);
    if (textContent) texts.push(textContent);

    const attrs = [
      "aria-label",
      "title",
      "data-csa-c-delivery-price",
      "data-csa-c-delivery-time",
      "data-csa-c-delivery-type",
      "data-csa-c-delivery-condition",
    ];

    for (const attr of attrs) {
      const value = element.getAttribute(attr);
      if (value) texts.push(cleanText(value));
    }

    return texts;
  }

  const prioritySelectors = [
    "#mir-layout-DELIVERY_BLOCK",
    "#deliveryBlockMessage",
    "#fast-track-message",
    "#deliveryMessageMirId",
    "#contextualIngressPtLabel_deliveryShortLine",
    "#contextualIngressPtLabel_deliveryShortLine .a-text-bold",
    "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
    "#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE",
    "[id*='DELIVERY_BLOCK']",
    "[id*='deliveryBlock']",
    "[id*='Delivery']",
    "[id*='delivery']",
    "[data-csa-c-delivery-price]",
    "[data-csa-c-delivery-time]",

    "[data-test-id*='cargo']",
    "[data-test-id*='kargo']",
    "[data-test-id*='shipping']",
    "[data-test-id*='delivery']",
    "[class*='cargo']",
    "[class*='kargo']",
    "[class*='shipping']",
    "[class*='delivery']",
    "[class*='Delivery']",
    "[class*='Shipment']",
    "[class*='free']",
    "[class*='Free']",
  ];

  const priorityCandidates = [];

  for (const selector of prioritySelectors) {
    const elements = Array.from(document.querySelectorAll(selector));

    for (const element of elements) {
      if (!isVisibleElement(element)) continue;

      const texts = collectTextFromElement(element);

      for (const text of texts) {
        if (!text) continue;
        if (text.length > 1200) continue;

        const result = analyzeShippingText(text);

        if (result) {
          priorityCandidates.push({
            text,
            result,
            score: result.freeShipping ? 1000 : 500,
          });
        }
      }
    }
  }

  const freePriorityMatch = priorityCandidates.find(
    (candidate) => candidate.result.freeShipping,
  );

  if (freePriorityMatch) {
    return freePriorityMatch.result;
  }

  const usablePriorityMatch = priorityCandidates
    .sort((a, b) => b.score - a.score)
    .find((candidate) => shouldUseResult(candidate.result));

  if (usablePriorityMatch) {
    return usablePriorityMatch.result;
  }

  const titleElement =
    document.querySelector("[data-test-id='title']") ||
    document.querySelector("#productTitle") ||
    document.querySelector("h1");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("button, a, span, div, p, li, strong"),
  );

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);

      if (!text) return false;
      if (text.length > 800) return false;

      const result = analyzeShippingText(text);
      if (!result) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect) {
        if (rect.top < titleRect.bottom - 160) return false;
        if (rect.top > titleRect.bottom + 1200) return false;
      }

      return true;
    })
    .map((element) => {
      const text = cleanText(element.textContent);
      const rect = element.getBoundingClientRect();
      const result = analyzeShippingText(text);

      let score = 0;

      if (result?.freeShipping) score += 800;
      if (result?.shippingAvailable) score += 200;

      score += Math.max(0, 260 - text.length);

      if (titleRect) {
        const distanceFromTitle = Math.abs(rect.top - titleRect.bottom);
        score += Math.max(0, 300 - distanceFromTitle);
      }

      if (host.includes("amazon") && rect.left > window.innerWidth * 0.55) {
        score += 200;
      }

      if (
        !host.includes("amazon") &&
        rect.left > window.innerWidth * 0.25 &&
        rect.left < window.innerWidth * 0.9
      ) {
        score += 80;
      }

      return {
        text,
        result,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  const freeCandidate = candidates.find(
    (candidate) => candidate.result.freeShipping,
  );

  if (freeCandidate) {
    return freeCandidate.result;
  }

  const usableCandidate = candidates.find((candidate) =>
    shouldUseResult(candidate.result),
  );

  if (usableCandidate) {
    return usableCandidate.result;
  }

  if (host.includes("amazon")) {
    const bodyText = cleanText(document.body.innerText || "");
    const bodyResult = analyzeShippingText(bodyText);

    if (bodyResult && bodyResult.freeShipping) {
      return bodyResult;
    }
  }

  return getDefaultShippingInfoForSite();
}

function findProductInJsonLd(data) {
  if (!data) return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findProductInJsonLd(item);
      if (found) return found;
    }
  }

  if (typeof data === "object") {
    const type = data["@type"];

    const isProduct =
      type === "Product" || (Array.isArray(type) && type.includes("Product"));

    if (isProduct) {
      return data;
    }

    if (data["@graph"]) {
      const foundInGraph = findProductInJsonLd(data["@graph"]);
      if (foundInGraph) return foundInGraph;
    }

    for (const key of Object.keys(data)) {
      if (typeof data[key] === "object") {
        const found = findProductInJsonLd(data[key]);
        if (found) return found;
      }
    }
  }

  return null;
}

function parseJsonLdProduct() {
  const scripts = document.querySelectorAll(
    "script[type='application/ld+json']",
  );

  for (const script of scripts) {
    try {
      const json = JSON.parse(script.textContent);
      const product = findProductInJsonLd(json);

      if (!product) continue;

      const offers = Array.isArray(product.offers)
        ? product.offers[0]
        : product.offers;

      let image = "";

      if (Array.isArray(product.image)) {
        image = product.image[0];
      } else if (typeof product.image === "string") {
        image = product.image;
      } else if (product.image && product.image.url) {
        image = product.image.url;
      }

      return {
        site: getSiteName(),
        title: cleanText(product.name),
        price: cleanPrice(
          offers?.price || offers?.lowPrice || offers?.highPrice,
        ),
        image,
        url: window.location.href,
      };
    } catch {
      continue;
    }
  }

  return null;
}

function parseMetaProduct() {
  const title =
    getAttr("meta[property='og:title']", "content") ||
    getAttr("meta[name='twitter:title']", "content") ||
    document.title;

  const image =
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content");

  const price =
    getAttr("meta[property='product:price:amount']", "content") ||
    getAttr("meta[property='og:price:amount']", "content") ||
    getAttr("meta[name='price']", "content");

  if (!title && !price && !image) return null;

  return {
    site: getSiteName(),
    title: cleanText(title),
    price: cleanPrice(price),
    image,
    url: window.location.href,
  };
}

function parseTrendyol() {
  return {
    site: "Trendyol",
    title:
      cleanText(getText(".pr-new-br")) ||
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText(".prc-dsc")) ||
      cleanPrice(getText(".prc-slg")) ||
      cleanPrice(getText(".product-price-container span")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")),
    image:
      getAttr(".base-product-image img", "src") ||
      getAttr(".gallery-modal-content img", "src") ||
      getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}

function findMainHepsiburadaPrice() {
  const titleElement =
    document.querySelector("[data-test-id='title']") ||
    document.querySelector("h1");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("span, div, ins, strong"),
  );

  const candidates = elements
    .filter((element) => {
      const text = cleanText(element.textContent);

      if (!isVisibleElement(element)) return false;
      if (!looksLikeTryPrice(text)) return false;
      if (hasChildWithPriceText(element)) return false;

      const rect = element.getBoundingClientRect();

      if (rect.left > window.innerWidth * 0.72) return false;
      if (titleRect && rect.top < titleRect.bottom - 30) return false;
      if (titleRect && rect.top > titleRect.bottom + 450) return false;

      return true;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const text = cleanText(element.textContent);

      let score = 0;

      score += fontSize * 8;
      score += fontWeight / 80;

      if (titleRect) {
        const distanceFromTitle = Math.abs(rect.top - titleRect.bottom);
        score += Math.max(0, 180 - distanceFromTitle);
      }

      if (
        rect.left > window.innerWidth * 0.28 &&
        rect.left < window.innerWidth * 0.7
      ) {
        score += 80;
      }

      if (
        /premium|kazanc|kazanç|indirim|kampanya|diğer|satici|satıcı|ürüne git|teslimat/i.test(
          text,
        )
      ) {
        score -= 250;
      }

      return {
        text,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.text || "";
}

function parseHepsiburada() {
  const mainPrice = findMainHepsiburadaPrice();

  return {
    site: "Hepsiburada",
    title:
      cleanText(getText("[data-test-id='title']")) ||
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(mainPrice) ||
      cleanPrice(getText("[data-test-id='price-current-price']")) ||
      cleanPrice(getText("[data-test-id='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")),
    image:
      getAttr("[data-test-id='product-image-image']", "src") ||
      getAttr("img[alt][src*='productimages']", "src") ||
      getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}
function findN11MainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForBasicSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(src)) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 120 || rect.height < 120) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const normalizedAlt = normalizeForBasicSearch(alt);
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (rect.left < window.innerWidth * 0.45) score += 220;
      if (rect.top < window.innerHeight * 0.85) score += 120;

      if (/product|urun|ürün|images|media|catalog|cdn/i.test(src)) score += 120;

      if (
        normalizedTitle &&
        normalizedAlt &&
        (normalizedTitle.includes(normalizedAlt.slice(0, 25)) ||
          normalizedAlt.includes(normalizedTitle.slice(0, 25)))
      ) {
        score += 250;
      }

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}

function findN11MainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForBasicSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(src)) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 120 || rect.height < 120) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const normalizedAlt = normalizeForBasicSearch(alt);
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (rect.left < window.innerWidth * 0.45) score += 220;
      if (rect.top < window.innerHeight * 0.85) score += 120;

      if (/product|urun|ürün|images|media|catalog|cdn/i.test(src)) score += 120;

      if (
        normalizedTitle &&
        normalizedAlt &&
        (normalizedTitle.includes(normalizedAlt.slice(0, 25)) ||
          normalizedAlt.includes(normalizedTitle.slice(0, 25)))
      ) {
        score += 250;
      }

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}
function parseN11() {
  return {
    site: "n11",
    title:
      cleanText(getText(".proName")) ||
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText(".newPrice ins")) ||
      cleanPrice(getText(".priceContainer .newPrice")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")),
    image: findN11MainImage(),
    url: window.location.href,
  };
}
function parseAmazonTr() {
  return {
    site: "Amazon TR",
    title: cleanText(getText("#productTitle")) || cleanText(getText("h1")),
    price:
      cleanPrice(getText(".a-price .a-offscreen")) ||
      cleanPrice(getText("#corePrice_feature_div .a-offscreen")) ||
      cleanPrice(getText("#priceblock_ourprice")) ||
      cleanPrice(getText("#priceblock_dealprice")),
    image:
      getAttr("#landingImage", "src") ||
      getAttr("#imgBlkFront", "src") ||
      getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}

function parseTeknosa() {
  return {
    site: "Teknosa",
    title:
      cleanText(getText(".pdp-title")) ||
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText(".prc")) ||
      cleanPrice(getText(".price")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")),
    image:
      getAttr(".gallery img", "src") ||
      getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}
function findVatanMainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForBasicSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      if (!isVisibleElement(img)) return false;

      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(src)) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 120 || rect.height < 120) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const normalizedAlt = normalizeForBasicSearch(alt);
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (rect.left < window.innerWidth * 0.55) score += 180;
      if (rect.top < window.innerHeight * 0.85) score += 120;

      if (/product|urun|ürün|images|media|resize/i.test(src)) score += 120;

      if (
        normalizedTitle &&
        normalizedAlt &&
        (normalizedTitle.includes(normalizedAlt.slice(0, 25)) ||
          normalizedAlt.includes(normalizedTitle.slice(0, 25)))
      ) {
        score += 250;
      }

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}

function parseVatan() {
  return {
    site: "Vatan Bilgisayar",
    title:
      cleanText(getText("h1")) ||
      cleanText(getText(".product-list__product-name")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText(".product-list__price")) ||
      cleanPrice(getText(".product-price")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")),
    image: findVatanMainImage(),
    url: window.location.href,
  };
}

function parseMediaMarkt() {
  return {
    site: "MediaMarkt",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText("[data-test='mms-price']")) ||
      cleanPrice(getText("[class*='Price']")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")),
    image:
      getAttr("picture img", "src") ||
      getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}
function findPazaramaMainPrice() {
  const titleElement =
    document.querySelector("h1") ||
    document.querySelector("[class*='product-title']") ||
    document.querySelector("[class*='ProductTitle']");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("span, div, p, strong"),
  );

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);

      if (!looksLikeTryPrice(text)) return false;
      if (hasChildWithPriceText(element)) return false;
      if (text.length > 90) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect) {
        if (rect.top < titleRect.bottom - 120) return false;
        if (rect.top > titleRect.bottom + 520) return false;
      }

      if (rect.left < window.innerWidth * 0.35) return false;
      if (rect.left > window.innerWidth * 0.85) return false;

      return true;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const text = cleanText(element.textContent);

      let score = 0;

      score += fontSize * 14;
      score += fontWeight / 60;

      if (titleRect) {
        const distanceFromTitle = Math.abs(rect.top - titleRect.bottom);
        score += Math.max(0, 280 - distanceFromTitle);
      }

      if (/sepette/i.test(text)) score += 60;

      if (
        /taksit|garanti|sigorta|kargo|teslimat|indirim|puan|kampanya|hizmet|ay|başlayan|baslayan|detay/i.test(
          text,
        )
      ) {
        score -= 400;
      }

      return {
        text,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.text || "";
}

function findPazaramaMainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForBasicSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      if (!isVisibleElement(img)) return false;

      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(src)) return false;
      if (/logo|icon|sprite|placeholder|loading|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 120 || rect.height < 120) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const normalizedAlt = normalizeForBasicSearch(alt);
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (rect.left < window.innerWidth * 0.55) score += 180;
      if (rect.top < window.innerHeight * 0.85) score += 120;

      if (/product|urun|ürün|images|media|resize|cdn/i.test(src)) score += 120;

      if (
        normalizedTitle &&
        normalizedAlt &&
        (normalizedTitle.includes(normalizedAlt.slice(0, 25)) ||
          normalizedAlt.includes(normalizedTitle.slice(0, 25)))
      ) {
        score += 250;
      }

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}

function parsePazarama() {
  const mainPrice = findPazaramaMainPrice();

  return {
    site: "Pazarama",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")) ||
      cleanText(document.title),
    price:
      cleanPrice(mainPrice) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")),
    image: findPazaramaMainImage(),
    url: window.location.href,
  };
}
function findIdefixMainPrice() {
  const titleElement =
    document.querySelector("h1") ||
    document.querySelector("[class*='ProductName']") ||
    document.querySelector("[class*='product-name']");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("span, div, p, strong"),
  );

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);

      if (!looksLikeTryPrice(text)) return false;
      if (hasChildWithPriceText(element)) return false;
      if (text.length > 70) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect) {
        if (rect.top < titleRect.bottom - 80) return false;
        if (rect.top > titleRect.bottom + 420) return false;
      }

      if (rect.left < window.innerWidth * 0.25) return false;
      if (rect.left > window.innerWidth * 0.75) return false;

      return true;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const text = cleanText(element.textContent);

      let score = 0;

      score += fontSize * 10;
      score += fontWeight / 70;

      if (titleRect) {
        const distanceFromTitle = Math.abs(rect.top - titleRect.bottom);
        score += Math.max(0, 240 - distanceFromTitle);
      }

      if (/sepette indirim/i.test(text)) score += 120;
      if (
        /ay alışveriş kredisi|alisveris kredisi|taksit|puan|kargo|satici|satıcı|kampanya/i.test(
          text,
        )
      ) {
        score -= 300;
      }

      return {
        text,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.text || "";
}

function findIdefixMainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      if (!isVisibleElement(img)) return false;

      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/placeholder|logo|icon|sprite|badge/i.test(src)) return false;
      if (/placeholder|logo|icon|sprite|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 80 || rect.height < 80) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (
        title &&
        alt &&
        normalizeForBasicSearch(title).includes(
          normalizeForBasicSearch(alt).slice(0, 25),
        )
      ) {
        score += 300;
      }

      if (/image|product|urun|ürün/i.test(src)) score += 120;
      if (rect.left < window.innerWidth * 0.5) score += 120;
      if (rect.top < window.innerHeight * 0.75) score += 80;

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}

function normalizeForBasicSearch(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseIdefix() {
  const mainPrice = findIdefixMainPrice();

  return {
    site: "idefix",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")) ||
      cleanText(document.title),
    price:
      cleanPrice(mainPrice) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")),
    image: findIdefixMainImage(),
    url: window.location.href,
  };
}

function findIdefixMainPrice() {
  const titleElement =
    document.querySelector("h1") ||
    document.querySelector("[class*='ProductName']") ||
    document.querySelector("[class*='product-name']");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(
    document.querySelectorAll("span, div, p, strong"),
  );

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);

      if (!looksLikeTryPrice(text)) return false;
      if (hasChildWithPriceText(element)) return false;
      if (text.length > 80) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect) {
        if (rect.top < titleRect.bottom - 100) return false;
        if (rect.top > titleRect.bottom + 460) return false;
      }

      if (rect.left < window.innerWidth * 0.25) return false;
      if (rect.left > window.innerWidth * 0.78) return false;

      return true;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const text = cleanText(element.textContent);

      let score = 0;

      score += fontSize * 12;
      score += fontWeight / 60;

      if (titleRect) {
        const distanceFromTitle = Math.abs(rect.top - titleRect.bottom);
        score += Math.max(0, 260 - distanceFromTitle);
      }

      if (/sepette indirim/i.test(text)) score += 130;

      if (
        /ay alışveriş kredisi|ay alisveris kredisi|alisveris kredisi|taksit|puan|kargo|satici|satıcı|kampanya|premium|ecoplus|detay/i.test(
          text,
        )
      ) {
        score -= 350;
      }

      return {
        text,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.text || "";
}

function findIdefixMainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForBasicSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .filter((img) => {
      if (!isVisibleElement(img)) return false;

      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";

      if (!src) return false;
      if (/placeholder|logo|icon|sprite|badge/i.test(src)) return false;
      if (/placeholder|logo|icon|sprite|badge/i.test(alt)) return false;

      const rect = img.getBoundingClientRect();

      if (rect.width < 80 || rect.height < 80) return false;

      return true;
    })
    .map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      const alt = cleanText(img.getAttribute("alt") || "");
      const normalizedAlt = normalizeForBasicSearch(alt);
      const rect = img.getBoundingClientRect();

      let score = 0;

      score += rect.width + rect.height;

      if (
        normalizedTitle &&
        normalizedAlt &&
        (normalizedTitle.includes(normalizedAlt.slice(0, 25)) ||
          normalizedAlt.includes(normalizedTitle.slice(0, 25)))
      ) {
        score += 300;
      }

      if (/image|product|urun|ürün|catalog|media/i.test(src)) score += 120;
      if (rect.left < window.innerWidth * 0.5) score += 160;
      if (rect.top < window.innerHeight * 0.8) score += 100;

      return {
        src,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}

function parseIdefix() {
  const mainPrice = findIdefixMainPrice();

  return {
    site: "idefix",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")) ||
      cleanText(document.title),
    price:
      cleanPrice(mainPrice) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")),
    image: findIdefixMainImage(),
    url: window.location.href,
  };
}

function parseGenericProduct() {
  const jsonLdProduct = parseJsonLdProduct();
  if (jsonLdProduct && jsonLdProduct.title) return jsonLdProduct;

  const metaProduct = parseMetaProduct();
  if (metaProduct && metaProduct.title) return metaProduct;

  return {
    site: getSiteName(),
    title: cleanText(document.title),
    price: null,
    image: getAttr("meta[property='og:image']", "content"),
    url: window.location.href,
  };
}

function normalizeProduct(product) {
  const fallback = parseGenericProduct();
  const installmentInfo = findInstallmentInfo();
  const shippingInfo = findShippingInfo();

  return {
    site: product?.site || fallback.site || getSiteName(),
    title: product?.title || fallback.title || cleanText(document.title),
    price: product?.price || fallback.price || null,
    image: product?.image || fallback.image || "",
    url: product?.url || window.location.href,

    installmentAvailable: installmentInfo.installmentAvailable,
    installmentText: installmentInfo.installmentText,

    shippingAvailable: shippingInfo.shippingAvailable,
    freeShipping: shippingInfo.freeShipping,
    shippingText: shippingInfo.shippingText,
    shippingSource: shippingInfo.shippingSource,
    shippingConfidence: shippingInfo.shippingConfidence,
  };
}

function getProductFromPage() {
  const host = window.location.hostname;

  let product = null;

  if (host.includes("trendyol")) {
    product = parseTrendyol();
  } else if (host.includes("hepsiburada")) {
    product = parseHepsiburada();
  } else if (host.includes("n11")) {
    product = parseN11();
  } else if (host.includes("amazon")) {
    product = parseAmazonTr();
  } else if (host.includes("teknosa")) {
    product = parseTeknosa();
  } else if (host.includes("vatanbilgisayar")) {
    product = parseVatan();
  } else if (host.includes("mediamarkt")) {
    product = parseMediaMarkt();
  } else if (host.includes("idefix")) {
    product = parseIdefix();
  } else if (host.includes("pazarama")) {
    product = parsePazarama();
  } else {
    product = parseGenericProduct();
  }

  return normalizeProduct(product);
}

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "GET_PRODUCT") {
    const product = getProductFromPage();

    if (!product.title) {
      return Promise.resolve({
        ok: false,
        error: "Ürün adı okunamadı.",
      });
    }

    return Promise.resolve({
      ok: true,
      product,
    });
  }
});
