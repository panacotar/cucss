import { HostFlagsStorage, RulesStorage } from "../utils/storage.js";

let styleTag = document.createElement('style');
styleTag.setAttribute('id', 'cucss');
document.body.appendChild(styleTag);

function onError(error) {
  console.error(`Error: ${error}`);
}

function update(value) {
  styleTag.textContent = value
  // Some browsers may effectively "refresh" a <style> element when its text
  // changes; re-assert disabled state so styles never apply when toggled off.
  styleTag.disabled = !applyStyles;
}

function updateRules(rules) {
  const host = window.location.host;

  // Apply URL-specific rules first (most specific)
  const normalizedPath = window.location.pathname.replace(/\/$/, "");
  const urlKey = host + normalizedPath;
  if (rules.urls?.[urlKey]) {
    update(rules.urls[urlKey]);
    return;
  }

  // Apply host rules
  if (rules.hosts?.[host]) {
    update(rules.hosts[host]);
    return;
  }

  // Apply global rules
  if (rules.global) {
    update(rules.global);
    return;
  }

  update("");
}

let rules;
let applyStyles = false;

async function init() {
  rules = await RulesStorage.getRules();
  applyStyles = await HostFlagsStorage.getHostEnabled(window.location.host);

  // Keep the computed CSS up to date even when disabled, so re-enabling
  // immediately uses the latest rules without needing another rules update.
  updateRules(rules);
  styleTag.disabled = !applyStyles;
}

init().catch(onError);

// Listen to local storage changes and update the style
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;

  // Rules updated
  if (RulesStorage.RULES_KEY in changes) {
    rules = changes[RulesStorage.RULES_KEY].newValue || {};
    // Always recompute CSS so the latest rules are ready when re-enabled.
    updateRules(rules);
    // Re-assert disabled state in case the style element was refreshed.
    styleTag.disabled = !applyStyles;
  }

  // Apply toggle updated
  if (HostFlagsStorage.HOST_FLAGS_KEY in changes) {
    const host = window.location.host;
    const hostFlags = changes[HostFlagsStorage.HOST_FLAGS_KEY].newValue || {};
    applyStyles = hostFlags?.[host] || false;
    styleTag.disabled = !applyStyles;
    if (applyStyles) updateRules(rules || {});
  }
})  
