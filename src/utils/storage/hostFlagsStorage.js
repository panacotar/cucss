const HOST_FLAGS_KEY = "cucssHostFlags";
const LEGACY_APPLY_STYLES_KEY = "applyStyles";

export { HOST_FLAGS_KEY };

export async function getHostEnabled(host) {
  if (!host) return false;

  const result = await browser.storage.local.get(HOST_FLAGS_KEY);
  const hostFlags = result[HOST_FLAGS_KEY] || {};
  if (Object.prototype.hasOwnProperty.call(hostFlags, host)) {
    return !!hostFlags[host];
  }

  const legacy = await browser.storage.local.get(LEGACY_APPLY_STYLES_KEY);
  return legacy[LEGACY_APPLY_STYLES_KEY] || false;
}

export async function setHostEnabled(host, enabled) {
  if (!host) return;

  const result = await browser.storage.local.get(HOST_FLAGS_KEY);
  const hostFlags = result[HOST_FLAGS_KEY] || {};
  hostFlags[host] = !!enabled;

  await browser.storage.local.set({ [HOST_FLAGS_KEY]: hostFlags });

  // Best-effort cleanup of legacy global toggle.
  try {
    if (browser.storage.local.remove) {
      await browser.storage.local.remove(LEGACY_APPLY_STYLES_KEY);
    } else {
      await browser.storage.local.set({ [LEGACY_APPLY_STYLES_KEY]: undefined });
    }
  } catch {
    // ignore
  }
}

