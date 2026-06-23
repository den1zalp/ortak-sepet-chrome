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

function normalizeForSearch(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^a-z0-9£$.,]+/g, " ")
    .trim();
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

function cleanPrice(rawPrice) {
  if (!rawPrice) return null;

  const text = cleanText(rawPrice)
    .replace(/\bnow\b/gi, "")
    .replace(/\bfrom\b/gi, "")
    .replace(/\bprice\b/gi, "")
    .trim();

  const matches = text.match(
    /£\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*(?:GBP|£)|\d+(?:\.\d{1,2})\s*(?:GBP|£)/gi
  );

  if (!matches || matches.length === 0) return null;

  const priceWithCurrency = matches.find((match) => /£|GBP/i.test(match));
  let cleaned = cleanText(priceWithCurrency || matches[0]).replace(/GBP/gi, "").trim();

  if (!/£/i.test(cleaned)) {
    cleaned = `£${cleaned}`;
  }

  return cleaned.replace(/\s+/g, "");
}

function looksLikeGbpPrice(text) {
  if (!text) return false;
  const clean = cleanText(text);

  return /£|GBP/i.test(clean) && /\d/.test(clean) && clean.length <= 90;
}

function hasChildWithPriceText(element) {
  return Array.from(element.children || []).some((child) =>
    looksLikeGbpPrice(child.textContent),
  );
}

function getBestSrcFromSrcset(srcset) {
  if (!srcset) return "";

  const candidates = String(srcset)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const pieces = part.split(/\s+/);
      const url = pieces[0] || "";
      const descriptor = pieces[1] || "";
      let score = 1;

      if (descriptor.endsWith("w")) {
        score = Number.parseInt(descriptor, 10) || 1;
      } else if (descriptor.endsWith("x")) {
        score = (Number.parseFloat(descriptor) || 1) * 1000;
      }

      return { url, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.url || "";
}

function toAbsoluteUrl(url) {
  if (!url) return "";

  try {
    return new URL(url, window.location.href).toString();
  } catch {
    return url;
  }
}

function getImageUrl(img) {
  if (!img) return "";

  const picture = img.closest("picture");
  const sourceSrcset = picture
    ? Array.from(picture.querySelectorAll("source"))
        .map((source) => source.getAttribute("srcset") || source.getAttribute("data-srcset") || "")
        .find(Boolean)
    : "";

  const candidates = [
    img.currentSrc,
    img.getAttribute("data-zoom-src"),
    img.getAttribute("data-src"),
    img.getAttribute("data-lazy-src"),
    img.getAttribute("data-original"),
    img.getAttribute("data-image"),
    img.getAttribute("data-hires"),
    img.getAttribute("data-testid-src"),
    getBestSrcFromSrcset(img.getAttribute("srcset")),
    getBestSrcFromSrcset(sourceSrcset),
    img.src,
    img.getAttribute("src"),
  ].filter(Boolean);

  const usable = candidates.find((url) =>
    !/data:image|base64|placeholder|loading|spacer|transparent|blank/i.test(url),
  );

  return toAbsoluteUrl(usable || candidates[0] || "");
}

function isBadImageCandidate(url, alt = "", element = null) {
  const nearbyText = element
    ? cleanText(
        [
          element.getAttribute?.("aria-label") || "",
          element.getAttribute?.("title") || "",
          element.closest?.("a, button, div, section, li")?.textContent || "",
        ].join(" "),
      ).slice(0, 260)
    : "";

  const combined = normalizeForSearch(`${url || ""} ${alt || ""} ${nearbyText}`);

  return /logo|icon|sprite|placeholder|loading|badge|avatar|profile|tracking|advert|banner|delivery|shipping|free next|next day|click collect|click and collect|collect in store|returns?|warranty|guarantee|credit|finance|klarna|clearpay|paypal|nectar|review|rating|star|store locator|argos logo|currys logo/i.test(
    combined,
  );
}


function getSiteName() {
  const host = window.location.hostname.replace("www.", "");

  if (host.includes("amazon.co.uk")) return "Amazon UK";
  if (host.includes("ebay.co.uk")) return "eBay UK";
  if (host.includes("vinted.co.uk")) return "Vinted UK";
  if (host.includes("argos.co.uk")) return "Argos";
  if (host.includes("currys.co.uk")) return "Currys";
  if (host.includes("diesel")) return "Diesel UK";

  return host;
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
      type === "Product" ||
      (Array.isArray(type) && type.includes("Product"));

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
  const scripts = document.querySelectorAll("script[type='application/ld+json']");

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
        price: cleanPrice(offers?.price || offers?.lowPrice || offers?.highPrice),
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

function scoreMainPriceCandidate(element, titleRect) {
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
    score += Math.max(0, 320 - distanceFromTitle);
  }

  if (rect.top < window.innerHeight * 0.9) score += 80;
  if (rect.left > window.innerWidth * 0.25 && rect.left < window.innerWidth * 0.9) score += 70;

  if (/sale|now|price|deal/i.test(text)) score += 50;

  if (
    /delivery|shipping|finance|monthly|month|klarna|clearpay|paypal|credit|collect|points|save|was|rrp|voucher|coupon|review/i.test(
      text,
    )
  ) {
    score -= 320;
  }

  return { text, score };
}

function findMainPrice() {
  const titleElement =
    document.querySelector("h1") ||
    document.querySelector("[data-testid*='title']") ||
    document.querySelector("[class*='title']");

  const titleRect = titleElement ? titleElement.getBoundingClientRect() : null;

  const elements = Array.from(document.querySelectorAll("span, div, p, strong, ins"));

  const candidates = elements
    .filter((element) => {
      if (!isVisibleElement(element)) return false;

      const text = cleanText(element.textContent);
      if (!looksLikeGbpPrice(text)) return false;
      if (hasChildWithPriceText(element)) return false;
      if (text.length > 90) return false;

      const rect = element.getBoundingClientRect();

      if (titleRect) {
        if (rect.top < titleRect.bottom - 180) return false;
        if (rect.top > titleRect.bottom + 760) return false;
      }

      return true;
    })
    .map((element) => scoreMainPriceCandidate(element, titleRect))
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.text || "";
}


function findMainImage() {
  const title =
    cleanText(getText("h1")) ||
    cleanText(getAttr("meta[property='og:title']", "content"));

  const normalizedTitle = normalizeForSearch(title);
  const images = Array.from(document.querySelectorAll("img"));

  const scoredImages = images
    .map((img) => {
      const src = getImageUrl(img);
      const alt = cleanText(img.getAttribute("alt") || "");
      const rect = img.getBoundingClientRect();

      if (!src) return null;
      if (isBadImageCandidate(src, alt, img)) return null;

      const visibleEnough = rect.width >= 80 && rect.height >= 80;
      const productUrl =
        /product|image|images|media|cdn|i\.ebayimg|ssl-images-amazon|scene7|productimages|media-very|media\.ao|argos|currys|vinted|diesel/i.test(
          src,
        );

      if (!visibleEnough && !productUrl) return null;

      const normalizedAlt = normalizeForSearch(alt);
      let score = 0;

      score += Math.max(0, rect.width) + Math.max(0, rect.height);

      if (rect.left < window.innerWidth * 0.62) score += 210;
      if (rect.top < window.innerHeight * 0.95) score += 130;

      if (/product|productimages|scene7|i\.ebayimg|ssl-images-amazon|vinted|diesel|currys|argos/i.test(src)) {
        score += 230;
      }

      if (/thumbnail|thumb|swatch|small|mini|selector/i.test(src)) score -= 160;

      if (normalizedTitle && normalizedAlt) {
        const titleStart = normalizedTitle.slice(0, 28);
        const altStart = normalizedAlt.slice(0, 28);

        if (normalizedTitle.includes(altStart) || normalizedAlt.includes(titleStart)) {
          score += 300;
        }
      }

      return { src, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return (
    scoredImages[0]?.src ||
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content")
  );
}


function getElementSearchText(element) {
  if (!element) return "";

  return cleanText(
    [
      element.textContent || "",
      element.getAttribute?.("aria-label") || "",
      element.getAttribute?.("title") || "",
      element.getAttribute?.("data-testid") || "",
      element.getAttribute?.("data-test-id") || "",
      element.getAttribute?.("data-key") || "",
      element.getAttribute?.("data-client-id") || "",
      element.getAttribute?.("class") || "",
      element.getAttribute?.("id") || "",
    ].join(" "),
  );
}

function getPaymentRelatedText() {
  const paymentSelector = [
    "klarna-placement",
    "[class*='klarna']",
    "[class*='Klarna']",
    "[class*='payment']",
    "[class*='Payment']",
    "[class*='finance']",
    "[class*='Finance']",
    "[id*='klarna']",
    "[id*='payment']",
    "[id*='finance']",
    "[data-testid*='payment']",
    "[data-testid*='klarna']",
    "[data-test-id*='payment']",
    "[data-test-id*='klarna']",
    "[data-key*='klarna']",
    "[data-client-id*='klarna']",
  ].join(", ");

  const parts = [
    document.body?.innerText || "",
    document.body?.textContent || "",
  ];

  function collectFromRoot(root, depth = 0) {
    if (!root || depth > 4) return;

    try {
      root.querySelectorAll(paymentSelector).forEach((element) => {
        parts.push(getElementSearchText(element));
      });

      root.querySelectorAll("*").forEach((element) => {
        if (element.shadowRoot) {
          parts.push(element.shadowRoot.textContent || "");
          collectFromRoot(element.shadowRoot, depth + 1);
        }
      });
    } catch {
      // Some roots may not support querySelectorAll in all contexts.
    }
  }

  collectFromRoot(document);

  const iframeText = Array.from(document.querySelectorAll("iframe"))
    .map((iframe) =>
      [
        iframe.getAttribute("src") || "",
        iframe.getAttribute("title") || "",
        iframe.getAttribute("name") || "",
      ].join(" "),
    )
    .join(" ");

  parts.push(iframeText);

  return cleanText(parts.join(" "));
}

function findFinanceInfo() {
  const bodyText = getPaymentRelatedText();
  const normalized = normalizeForSearch(bodyText);

  const negativeFinance = /finance not available|credit not available|not eligible for finance|pay monthly unavailable/i.test(normalized);

  if (negativeFinance) {
    return {
      installmentAvailable: false,
      installmentText: "Finance not available",
    };
  }

  if (window.location.hostname.includes("diesel")) {
    const dieselPaymentMatch = bodyText.match(
      /make\s+(\d+)\s+payments?\s+of\s*(£\s?[\d,]+(?:\.\d{2})?)/i,
    );
    const hasDieselPaymentPlan =
      Boolean(dieselPaymentMatch) ||
      /pay\s+in\s+\d+/i.test(bodyText) ||
      /interest[-\s]?free\s+payments?/i.test(bodyText);
    const hasDieselKlarna =
      (/klarna/i.test(bodyText) && hasDieselPaymentPlan) ||
      Boolean(dieselPaymentMatch);

    if (dieselPaymentMatch || hasDieselKlarna) {
      return {
        installmentAvailable: true,
        installmentText: dieselPaymentMatch
          ? `${dieselPaymentMatch[1]} payments of ${dieselPaymentMatch[2]} via Klarna`
          : "Klarna instalments available",
      };
    }
  }

  const financePatterns = [
    /klarna/i,
    /clearpay/i,
    /paypal credit/i,
    /pay in\s*3/i,
    /pay later/i,
    /buy now pay later/i,
    /monthly payments?/i,
    /finance available/i,
    /0%\s*interest/i,
    /interest free credit/i,
    /instalments?/i,
    /installments?/i,
    /spread the cost/i,
  ];

  if (financePatterns.some((pattern) => pattern.test(bodyText))) {
    return {
      installmentAvailable: true,
      installmentText: "Finance / pay later available",
    };
  }

  return {
    installmentAvailable: false,
    installmentText: "Finance information not found",
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDieselFinanceInfo(maxWaitMs = 1800) {
  const startedAt = Date.now();
  let latestInfo = findFinanceInfo();

  while (
    latestInfo.installmentAvailable !== true &&
    Date.now() - startedAt < maxWaitMs
  ) {
    await wait(300);
    latestInfo = findFinanceInfo();
  }

  return latestInfo;
}

function getDefaultShippingInfoForSite() {
  const host = window.location.hostname;

  if (host.includes("amazon.co.uk")) {
    return {
      shippingAvailable: false,
      freeShipping: false,
      shippingText: "Delivery depends on address / checkout",
      shippingSource: "checkout",
      shippingConfidence: "site-default",
    };
  }

  if (host.includes("vinted.co.uk")) {
    return {
      shippingAvailable: false,
      freeShipping: false,
      shippingText: "Buyer protection / delivery calculated by Vinted",
      shippingSource: "checkout",
      shippingConfidence: "site-default",
    };
  }

  return {
    shippingAvailable: false,
    freeShipping: false,
    shippingText: "Delivery calculated at checkout",
    shippingSource: "checkout",
    shippingConfidence: "unknown",
  };
}


function findShippingInfo() {
  const bodyText = cleanText(document.body?.innerText || document.body?.textContent || "");
  const normalized = normalizeForSearch(bodyText);
  const host = window.location.hostname;

  if (/free delivery|free shipping|delivery free|shipping free|free standard delivery|free next day delivery/i.test(normalized)) {
    return {
      shippingAvailable: true,
      freeShipping: true,
      shippingText: /next day/i.test(normalized) ? "Free next day delivery" : "Free delivery",
      shippingSource: "product-page",
      shippingConfidence: "explicit",
    };
  }

  if (/click and collect|click & collect|collect in store|collection available/i.test(normalized)) {
    return {
      shippingAvailable: true,
      freeShipping: false,
      shippingText: "Click & Collect available",
      shippingSource: "product-page",
      shippingConfidence: "explicit",
    };
  }

  if (/next day delivery|standard delivery|home delivery|delivery available|shipping available|delivery options?/i.test(normalized)) {
    return {
      shippingAvailable: true,
      freeShipping: false,
      shippingText: host.includes("currys.co.uk") ? "Delivery information available" : "Delivery options available",
      shippingSource: "product-page",
      shippingConfidence: "generic",
    };
  }

  return getDefaultShippingInfoForSite();
}




function findImageBySelectors(selectors) {
  const candidates = [];

  for (const selector of selectors) {
    const elements = Array.from(document.querySelectorAll(selector));

    for (const element of elements) {
      const imageElements =
        element.tagName && element.tagName.toLowerCase() === "img"
          ? [element]
          : Array.from(element.querySelectorAll ? element.querySelectorAll("img") : []);

      for (const img of imageElements) {
        const url = getImageUrl(img);
        const alt = cleanText(img.getAttribute("alt") || "");
        if (!url) continue;
        if (isBadImageCandidate(url, alt, img)) continue;

        const rect = img.getBoundingClientRect();
        const width = Math.max(0, rect.width);
        const height = Math.max(0, rect.height);

        const productish =
          /product|productimages|scene7|media|images|cdn|i\.ebayimg|ssl-images-amazon|vinted|diesel|currys|argos/i.test(
            url,
          );

        if (width < 60 && height < 60 && !productish) continue;

        let score = width + height;
        if (width >= 180 && height >= 180) score += 220;
        if (rect.left < window.innerWidth * 0.65) score += 120;
        if (rect.top < window.innerHeight * 0.95) score += 80;
        if (productish) score += 160;
        if (/thumbnail|thumb|swatch|small|mini|selector/i.test(url)) score -= 140;

        candidates.push({ url, score });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.url || "";
}


function getTextBySelectors(selectors) {
  for (const selector of selectors) {
    const text = cleanText(getText(selector));
    if (text) return text;
  }

  return "";
}


function formatGbpCurrencyFromNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;

  return `£${number.toFixed(2)}`;
}

function cleanAmazonGbpPrice(rawPrice) {
  const cleaned = cleanPrice(rawPrice);
  if (cleaned) return cleaned;

  const raw = cleanText(rawPrice);
  if (!raw) return null;

  const numericMatch = raw.match(/\b\d+(?:[.]\d{1,2})\b/);
  if (!numericMatch) return null;

  return formatGbpCurrencyFromNumber(Number.parseFloat(numericMatch[0]));
}

function getAmazonUkMainAreaText() {
  const selectors = [
    "#rightCol",
    "#centerCol",
    "#desktop_buybox",
    "#buybox",
    "#availability",
    "#merchant-info",
    "#corePrice_feature_div",
    "#corePriceDisplay_desktop_feature_div",
    "#apex_desktop",
  ];

  return cleanText(
    selectors
      .map((selector) => document.querySelector(selector)?.innerText || "")
      .filter(Boolean)
      .join(" "),
  );
}

function isAmazonUkMainOfferUnavailable() {
  const text = getAmazonUkMainAreaText().toLowerCase();

  return /see all buying options|currently unavailable|temporarily out of stock|out of stock|unavailable|higher than typical price/i.test(text);
}

function findAmazonUkMainPrice() {
  const scopedSelectors = [
    "#corePrice_feature_div .a-price .a-offscreen",
    "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen",
    "#apex_desktop .a-price .a-offscreen",
    "#corePrice_feature_div #priceblock_ourprice",
    "#corePrice_feature_div #priceblock_dealprice",
    "#corePrice_feature_div #price_inside_buybox",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    "#price_inside_buybox",
    "#newBuyBoxPrice",
    "#tp_price_block_total_price_ww .a-offscreen",
    "#sns-base-price .a-offscreen",
  ];

  for (const selector of scopedSelectors) {
    const elements = Array.from(document.querySelectorAll(selector));

    for (const element of elements) {
      const text = cleanText(element.textContent || element.getAttribute("content") || "");
      const price = cleanAmazonGbpPrice(text);

      if (price) return price;
    }
  }

  const metaPrice =
    cleanAmazonGbpPrice(getAttr("meta[property='product:price:amount']", "content")) ||
    cleanAmazonGbpPrice(getAttr("meta[property='og:price:amount']", "content"));

  if (metaPrice) return metaPrice;

  // Do not scan the whole page on Amazon. Recommendation carousel prices are
  // commonly shown when the main product is unavailable or has no direct offer.
  if (isAmazonUkMainOfferUnavailable()) return null;

  return null;
}

function parseAmazonUk() {
  const mainPrice = findAmazonUkMainPrice();
  const offerUnavailable = !mainPrice && isAmazonUkMainOfferUnavailable();

  return {
    site: "Amazon UK",
    title: cleanText(getText("#productTitle")) || cleanText(getText("h1")),
    price: mainPrice,
    preventPriceFallback: true,
    priceReadStatus: offerUnavailable ? "unavailable" : mainPrice ? "ok" : null,
    priceUnavailableReason: offerUnavailable ? "noActiveOffer" : null,
    stockAvailable: offerUnavailable ? false : null,
    stockText: offerUnavailable ? "noActiveOffer" : "",
    image:
      getAttr("#landingImage", "src") ||
      getAttr("#imgBlkFront", "src") ||
      getAttr("meta[property='og:image']", "content") ||
      findMainImage(),
    url: window.location.href,
  };
}

function parseEbayUk() {
  const title =
    getTextBySelectors([
      "h1.x-item-title__mainTitle",
      "h1.x-item-title__mainTitle .ux-textspans",
      "[data-testid='x-item-title']",
      "[data-testid='x-item-title'] .ux-textspans",
      "h1[itemprop='name']",
      "h1",
    ]) ||
    cleanText(getAttr("meta[property='og:title']", "content")) ||
    cleanText(document.title);

  const price =
    cleanPrice(getTextBySelectors([
      ".x-price-primary",
      ".x-price-primary .ux-textspans",
      "[data-testid='x-price-primary']",
      "[data-testid='x-price-primary'] .ux-textspans",
      "#prcIsum",
      "#mm-saleDscPrc",
      "[itemprop='price']",
      "[class*='price-primary']",
    ])) ||
    cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
    cleanPrice(getAttr("meta[property='og:price:amount']", "content")) ||
    cleanPrice(findMainPrice());

  const image =
    findImageBySelectors([
      "#icImg",
      "img#icImg",
      "[data-testid='ux-image-carousel-item'] img",
      ".ux-image-carousel-item img",
      ".ux-image-carousel img",
      "img[src*='i.ebayimg.com']",
      "img[data-zoom-src*='i.ebayimg.com']",
    ]) ||
    getAttr("meta[property='og:image']", "content") ||
    findMainImage();

  return {
    site: "eBay UK",
    title,
    price,
    image,
    url: window.location.href,
  };
}

function parseVintedUk() {
  return {
    site: "Vinted UK",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")) ||
      cleanText(document.title),
    price:
      cleanPrice(getText("[data-testid*='item-price']")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(findMainPrice()),
    image:
      getAttr("[data-testid*='item-photo'] img", "src") ||
      getAttr("meta[property='og:image']", "content") ||
      findMainImage(),
    url: window.location.href,
  };
}


function parseArgosUk() {
  const image =
    findImageBySelectors([
      "[data-test='product-media']",
      "[data-test*='product-media']",
      "[data-test='product-image']",
      "[data-test*='product-image']",
      "[data-testid*='product-image']",
      "[data-testid*='media']",
      "[class*='ProductImage']",
      "[class*='product-image']",
      "[class*='MediaGallery']",
      "[class*='media-gallery']",
      "[class*='gallery']",
      "main picture",
      "main img",
      "img[src*='scene7']",
      "img[src*='product']",
    ]) ||
    findMainImage() ||
    getAttr("meta[property='og:image']", "content");

  return {
    site: "Argos",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText("[data-test='product-price']")) ||
      cleanPrice(getText("[data-test*='price']")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")) ||
      cleanPrice(findMainPrice()),
    image,
    url: window.location.href,
  };
}



function findCurrysMainImage() {
  const metaImage =
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content");

  if (metaImage && !isBadImageCandidate(metaImage, "")) {
    return toAbsoluteUrl(metaImage);
  }

  const selectors = [
    "main [class*='product'] img",
    "main [class*='Product'] img",
    "main [class*='gallery'] img",
    "main [class*='Gallery'] img",
    "main [class*='carousel'] img",
    "main picture img",
    "[data-testid*='product-image'] img",
    "[data-test*='product-image'] img",
    "img[src*='product']",
    "img[src*='currys']"
  ];

  const images = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  const uniqueImages = Array.from(new Set(images));

  const candidates = uniqueImages
    .map((img, index) => {
      const src = getImageUrl(img);
      const alt = cleanText(img.getAttribute("alt") || "");
      if (!src) return null;
      if (isBadImageCandidate(src, alt, img)) return null;

      const rect = img.getBoundingClientRect();
      const width = Math.max(0, rect.width);
      const height = Math.max(0, rect.height);
      const area = width * height;

      const productish = /product|media|images|cdn|currys/i.test(src);

      if (area < 2500 && !productish) return null;

      let score = 0;

      score += area;
      score += Math.max(0, width + height) * 8;

      if (rect.left < window.innerWidth * 0.65) score += 35000;
      if (rect.top < window.innerHeight * 0.95) score += 25000;
      if (productish) score += 20000;

      if (/thumbnail|thumb|swatch|small|mini|selector/i.test(src)) score -= 45000;

      return { src, score, index };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });

  return candidates[0]?.src || "";
}


function parseCurrysUk() {
  const image =
    findCurrysMainImage() ||
    findImageBySelectors([
      "[data-testid*='product-image']",
      "[data-test*='product-image']",
      "[class*='ProductImage']",
      "[class*='product-image']",
      "[class*='product-gallery']",
      "[class*='ProductGallery']",
      "[class*='gallery']",
      "[class*='carousel']",
      "main picture",
      "main img",
      "img[src*='product']",
      "img[src*='currys']",
    ]) ||
    findMainImage();

  return {
    site: "Currys",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")),
    price:
      cleanPrice(getText("[data-test='product-price']")) ||
      cleanPrice(getText("[data-testid*='price']")) ||
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(getAttr("meta[property='og:price:amount']", "content")) ||
      cleanPrice(findMainPrice()),
    image,
    url: window.location.href,
  };
}



function getCssBackgroundImageUrl(element) {
  if (!element) return "";

  const backgroundImage = window.getComputedStyle(element).backgroundImage || "";
  const match = backgroundImage.match(/url\((['"]?)(.*?)\1\)/i);

  return toAbsoluteUrl(match?.[2] || "");
}

function findDieselMainImage() {
  const metaImage =
    getAttr("meta[property='og:image']", "content") ||
    getAttr("meta[name='twitter:image']", "content");

  if (metaImage && !isBadImageCandidate(metaImage)) {
    return toAbsoluteUrl(metaImage);
  }

  const galleryImage = findImageBySelectors([
    "main [class*='product-gallery']",
    "main [class*='ProductGallery']",
    "main [class*='product-media']",
    "main [class*='ProductMedia']",
    "main [class*='pdp'] picture",
    "main [class*='PDP'] picture",
    "main picture",
  ]);

  if (galleryImage) return galleryImage;

  const backgroundCandidates = Array.from(
    document.querySelectorAll(
      "main [class*='product'], main [class*='Product'], main [class*='gallery'], main [class*='Gallery'], main [class*='media'], main [class*='Media']",
    ),
  )
    .map((element) => {
      const src = getCssBackgroundImageUrl(element);
      const rect = element.getBoundingClientRect();

      if (!src || rect.width < 160 || rect.height < 160) return null;
      if (isBadImageCandidate(src, "", element)) return null;

      let score = rect.width * rect.height;
      if (rect.left < window.innerWidth * 0.72) score += 250000;
      if (/product|gallery|media|pdp/i.test(element.className || "")) score += 150000;

      return { src, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return backgroundCandidates[0]?.src || findMainImage();
}

function getDieselImageElements() {
  const selectors = [
    "main [class*='product-gallery'] img",
    "main [class*='ProductGallery'] img",
    "main [class*='product-media'] img",
    "main [class*='ProductMedia'] img",
    "main [class*='pdp'] img",
    "main [class*='PDP'] img",
    "main picture img",
    "main img",
  ];

  const images = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector)),
  );

  return Array.from(new Set(images))
    .map((img) => {
      const rect = img.getBoundingClientRect();
      const src = getImageUrl(img);
      const alt = cleanText(img.getAttribute("alt") || "");

      if (!src || isBadImageCandidate(src, alt, img)) return null;
      if (rect.width < 180 || rect.height < 180) return null;

      let score = rect.width * rect.height;
      if (rect.left < window.innerWidth * 0.72) score += 250000;
      score += Math.max(
        0,
        500000 - Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) * 800,
      );
      if (/product|gallery|media|pdp/i.test(img.closest("[class]")?.className || "")) {
        score += 150000;
      }

      return { img, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((candidate) => candidate.img);
}

async function createDieselImageDataUrl() {
  const images = getDieselImageElements();

  for (const img of images) {
    try {
      if (!img.complete || !img.naturalWidth) {
        await img.decode();
      }

      if (!img.naturalWidth || !img.naturalHeight) continue;

      const maxWidth = 320;
      const maxHeight = 420;
      const scale = Math.min(
        maxWidth / img.naturalWidth,
        maxHeight / img.naturalHeight,
        1,
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

      const context = canvas.getContext("2d");
      if (!context) continue;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/jpeg", 0.82);
    } catch {
      // Cross-origin canvas engellenirse sıradaki görsel denenir.
    }
  }

  return "";
}

function parseDieselUk() {
  return {
    site: "Diesel UK",
    title:
      cleanText(getText("h1")) ||
      cleanText(getAttr("meta[property='og:title']", "content")) ||
      cleanText(document.title),
    price:
      cleanPrice(getText("[class*='price']")) ||
      cleanPrice(getAttr("meta[property='product:price:amount']", "content")) ||
      cleanPrice(findMainPrice()),
    image: findDieselMainImage(),
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
    price: cleanPrice(findMainPrice()),
    image: findMainImage(),
    url: window.location.href,
  };
}

function normalizeProduct(product) {
  const fallback = parseGenericProduct();
  const financeInfo = findFinanceInfo();
  const shippingInfo = findShippingInfo();

  return {
    site: product?.site || fallback.site || getSiteName(),
    title: product?.title || fallback.title || cleanText(document.title),
    price: product?.price || (product?.preventPriceFallback === true ? null : fallback.price) || null,
    priceReadStatus: product?.priceReadStatus || fallback.priceReadStatus || null,
    priceUnavailableReason: product?.priceUnavailableReason || fallback.priceUnavailableReason || null,
    stockAvailable: product?.stockAvailable ?? fallback.stockAvailable ?? null,
    stockText: product?.stockText || fallback.stockText || "",
    image: product?.image || fallback.image || "",
    url: product?.url || window.location.href,

    installmentAvailable: financeInfo.installmentAvailable,
    installmentText: financeInfo.installmentText,

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

  if (host.includes("amazon.co.uk")) {
    product = parseAmazonUk();
  } else if (host.includes("ebay.co.uk")) {
    product = parseEbayUk();
  } else if (host.includes("vinted.co.uk")) {
    product = parseVintedUk();
  } else if (host.includes("argos.co.uk")) {
    product = parseArgosUk();
  } else if (host.includes("currys.co.uk")) {
    product = parseCurrysUk();
  } else if (host.includes("diesel")) {
    product = parseDieselUk();
  } else {
    product = parseGenericProduct();
  }

  return normalizeProduct(product);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "GET_PRODUCT") {
    (async () => {
      const product = getProductFromPage();

      if (window.location.hostname.includes("diesel")) {
        const captureImage = getDieselImageElements()[0];
        const captureRect = captureImage?.getBoundingClientRect();

        if (captureRect && captureRect.width > 0 && captureRect.height > 0) {
          product.imageCaptureRect = {
            left: captureRect.left,
            top: captureRect.top,
            width: captureRect.width,
            height: captureRect.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          };
        }

        product.image = (await createDieselImageDataUrl()) || product.image;

        const dieselFinanceInfo = await waitForDieselFinanceInfo();
        product.installmentAvailable = dieselFinanceInfo.installmentAvailable;
        product.installmentText = dieselFinanceInfo.installmentText;
      }

      if (!product.title) {
        sendResponse({
          ok: false,
          error: "Product title could not be read.",
        });
        return;
      }

      sendResponse({
        ok: true,
        product,
      });
    })().catch(() => {
      sendResponse({
        ok: false,
        error: "Product information could not be read.",
      });
    });

    return true;
  }

  return false;
});
