import { Storage } from "../utils/storage.js";

let styleTag = document.createElement('style');
styleTag.setAttribute('id', 'cucss');
document.body.appendChild(styleTag);

function onError(error) {
  console.error(`Error: ${error}`);
}

function update(value) {
  styleTag.textContent = value
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
  rules = await Storage.getRules();
  const result = await browser.storage.local.get("applyStyles");
  applyStyles = result.applyStyles || false;

  styleTag.disabled = !applyStyles;
  if (applyStyles) {
    updateRules(rules);
  }
}

init().catch(onError);

// Listen to local storage changes and update the style
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;

  // Rules updated
  if (Storage.RULES_KEY in changes) {
    rules = changes[Storage.RULES_KEY].newValue || {};
    if (applyStyles) updateRules(rules);
  }

  // Apply toggle updated
  if ("applyStyles" in changes) {
    applyStyles = changes.applyStyles.newValue || false;
    styleTag.disabled = !applyStyles;
    if (applyStyles) updateRules(rules || {});
  }
})  
