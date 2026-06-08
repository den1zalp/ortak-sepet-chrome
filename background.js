importScripts("browser-polyfill.js");

const CART_KEY = "ortakSepetItems";

async function getCartItems() {
  const result = await browser.storage.local.get(CART_KEY);
  return result[CART_KEY] || [];
}

async function saveCartItems(items) {
  await browser.storage.local.set({
    [CART_KEY]: items,
  });
}

async function updateBadge() {
  const items = await getCartItems();

  const totalCount = items.reduce((sum, item) => {
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
    return sum + quantity;
  }, 0);

  await browser.action.setBadgeText({
    text: totalCount === 0 ? "" : totalCount > 99 ? "99+" : String(totalCount),
  });

  await browser.action.setBadgeBackgroundColor({
    color: "#E53935",
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(text) {
  if (!text) return "";
  return String(text).replace(/\s+/g, " ").trim();
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

function arePricesEqual(oldPrice, newPrice) {
  const oldNumber = extractNumberFromPrice(oldPrice);
  const newNumber = extractNumberFromPrice(newPrice);

  if (oldNumber !== null && newNumber !== null) {
    return Math.abs(oldNumber - newNumber) < 0.01;
  }

  return cleanText(oldPrice) === cleanText(newPrice);
}

async function notifyProgress(payload) {
  try {
    await browser.runtime.sendMessage(payload);
  } catch {
    // Popup kapalıysa progress mesajını geç.
  }
}

async function waitForTabComplete(tabId, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      browser.tabs.onUpdated.removeListener(onUpdated);
    };

    const finish = () => {
      cleanup();
      resolve();
    };

    const fail = (message) => {
      cleanup();
      reject(new Error(message));
    };

    const onUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        finish();
      }
    };

    const timer = setTimeout(() => {
      fail("Sayfa yüklenme süresi doldu.");
    }, timeoutMs);

    browser.tabs.onUpdated.addListener(onUpdated);

    browser.tabs
      .get(tabId)
      .then((tab) => {
        if (tab.status === "complete") {
          finish();
        }
      })
      .catch(() => {
        fail("Sekme okunamadı.");
      });
  });
}

async function readProductFromTabWithRetry(tabId, attempts = 10, waitMs = 900) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await browser.tabs.sendMessage(tabId, {
        type: "GET_PRODUCT",
      });

      if (
        response &&
        response.ok &&
        response.product &&
        response.product.title &&
        response.product.price
      ) {
        return response.product;
      }
    } catch {
      // content.js henüz hazır olmayabilir.
    }

    await delay(waitMs);
  }

  throw new Error("Ürün bilgisi veya fiyat okunamadı.");
}

async function updateSingleItem(item) {
  if (!item.url) {
    return {
      ok: false,
      item: {
        ...item,
        lastUpdateStatus: "failed",
        lastUpdateError: "Ürün linki yok.",
        lastCheckedAt: new Date().toISOString(),
      },
    };
  }

  let tab = null;

  try {
    tab = await browser.tabs.create({
      url: item.url,
      active: false,
    });

    await waitForTabComplete(tab.id);
    await delay(1200);

    const freshProduct = await readProductFromTabWithRetry(tab.id);

    const oldPrice = item.price || null;
    const detectedPrice =
      freshProduct.price || item.detectedPrice || item.price || null;

    const keepManualPrice = item.manualPrice === true;
    const newPrice = keepManualPrice ? item.price : detectedPrice;
    const priceChanged = keepManualPrice
      ? false
      : !arePricesEqual(oldPrice, newPrice);

    return {
      ok: true,
      priceChanged,
      oldPrice,
      newPrice,
      item: {
        ...item,

        title: freshProduct.title || item.title,
        price: newPrice,
        detectedPrice,
        manualPrice: keepManualPrice,
        image: freshProduct.image || item.image,
        site: freshProduct.site || item.site,
        url: item.url,

        installmentAvailable: freshProduct.installmentAvailable,
        installmentText: freshProduct.installmentText,

        shippingAvailable: freshProduct.shippingAvailable,
        freeShipping: freshProduct.freeShipping,
        shippingText: freshProduct.shippingText,
        shippingSource: freshProduct.shippingSource,
        shippingConfidence: freshProduct.shippingConfidence,

        previousPrice: priceChanged ? oldPrice : item.previousPrice,
        lastCheckedAt: new Date().toISOString(),
        lastUpdateStatus: keepManualPrice ? "manual-kept" : "success",
        lastUpdateError: null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      item: {
        ...item,
        lastCheckedAt: new Date().toISOString(),
        lastUpdateStatus: "failed",
        lastUpdateError: error.message || "Güncelleme başarısız.",
      },
    };
  } finally {
    if (tab && tab.id) {
      try {
        await browser.tabs.remove(tab.id);
      } catch {
        // Sekme zaten kapanmış olabilir.
      }
    }
  }
}

async function updateAllPrices() {
  const items = await getCartItems();

  if (items.length === 0) {
    return {
      ok: true,
      total: 0,
      updated: 0,
      changed: 0,
      failed: 0,
    };
  }

  const updatedItems = [...items];

  let updated = 0;
  let changed = 0;
  let failed = 0;

  for (let index = 0; index < updatedItems.length; index++) {
    const currentItem = updatedItems[index];

    await notifyProgress({
      type: "UPDATE_PRICES_PROGRESS",
      current: index + 1,
      total: updatedItems.length,
      title: currentItem.title || "Ürün",
    });

    const result = await updateSingleItem(currentItem);

    updatedItems[index] = result.item;

    if (result.ok) {
      updated += 1;

      if (result.priceChanged) {
        changed += 1;
      }
    } else {
      failed += 1;
    }

    await saveCartItems(updatedItems);
    await delay(700);
  }

  await notifyProgress({
    type: "UPDATE_PRICES_DONE",
    total: updatedItems.length,
    updated,
    changed,
    failed,
  });

  return {
    ok: true,
    total: updatedItems.length,
    updated,
    changed,
    failed,
  };
}

browser.runtime.onMessage.addListener((message) => {
  if (message && message.type === "UPDATE_ALL_PRICES") {
    return updateAllPrices();
  }

  return false;
});

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[CART_KEY]) {
    updateBadge();
  }
});

browser.runtime.onInstalled.addListener(updateBadge);
browser.runtime.onStartup.addListener(updateBadge);

updateBadge();
