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
  // Apply host rules
  if (rules.hosts?.[host]) {
    update(rules.hosts[host]);
    return;
  }

  // Apply global rules
  if (rules.global) {
    update(rules.global);
  }
}

async function getRules() {
  // Todo: change to module and use the Storage helper class
  const result = await browser.storage.local.get("styleRules");
  return result["styleRules"] || {};
}

let rules;

async function init() {
  rules = await getRules();
  const { applyStyles } = await browser.storage.local.get("applyStyles");

  styleTag.disabled = !applyStyles;
  if (applyStyles) {
    updateRules(rules);
  }
}

init().catch(onError);

// Listen to local storage changes and update the style
browser.storage.onChanged.addListener((changes, area) => {
  // // Check for changes in local storage and 'applyStyles' key
  if (area === 'local' && 'applyStyles' in changes) {
    const applyStyles = changes.applyStyles.newValue;
    styleTag.disabled = !applyStyles;
    if (applyStyles) {
      updateRules(rules);
    }
  }
})