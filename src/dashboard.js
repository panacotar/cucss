import { Storage } from "./utils/storage.js";
import { view } from "./utils/codemirror.js";
import { exportStyles } from "./utils/styleTransfer.js";

const submitButton = document.getElementById('submit-button');

// Read the ?url-prefix= parameter from the URL
function getUrlPrefix() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('url-prefix') || "";
}

function parseUrlPrefix(urlPrefix) {
  if (!urlPrefix) return "";

  try {
    const url = new URL(urlPrefix);
    return url.host;
  } catch (e) {
    console.error("Invalid URL prefix:", urlPrefix);
    return "";
  }
}

async function initCodeTextarea(host) {
  let code = await Storage.getHostStyle(host);
  // Set CodeMirror editor content
  if (window.view) {
    window.view.dispatch({
      changes: { from: 0, to: window.view.state.doc.length, insert: code }
    });
  } else if (typeof view !== 'undefined') {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: code }
    });
  }
}

function init() {
  const urlPrefix = getUrlPrefix();
  const host = parseUrlPrefix(urlPrefix) || "<insert_host>";

  initCodeTextarea(host);
  document.getElementById('host').value = host;
}

init();

// Enable submit button when code is changed
document.getElementById('code').addEventListener('input', () => {
  submitButton.removeAttribute('disabled');
});

// Handle form submission
document.getElementById('style-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const host = document.getElementById('host').value.trim();
  if (host === "<insert_host>" || host === "") {
    alert("Please enter a valid host.");
    return;
  }

  // Get code from CodeMirror editor instance
  const code = view.state.doc.toString();
  // Remove newlines and extra spaces for basic validation
  // const normalizedCode = code.replace(/\s+/g, ' ').trim();
  // Remove extra spaces for basic validation
  const normalizedCode = code.trim();

  // Todo: Validate CSS code (basic check)...";
  // Store the CSS code in local storage
  await Storage.setHostStyle(host, normalizedCode);
  submitButton.setAttribute('disabled', true);
});

// Export styles button handler
document.getElementById('export-button').addEventListener('click', async () => {
  await exportStyles();
})

// On page load, list all stored styles in the ul element
async function listStoredStyles() {
  const styles = await Storage.getRules();
  const list = document.getElementById('stored-styles');
  list.innerHTML = "";
  
  if (styles.global) {
    const li = document.createElement('li');
    li.textContent = `Global Style: ${styles.global.substring(0, 30)}...`;
    list.appendChild(li);
  }

  if (styles.hosts) {
    for (const [host, css] of Object.entries(styles.hosts)) {
      const li = document.createElement('li');
      li.textContent = `Host: ${host} - Style: ${css.substring(0, 30)}...`;
      list.appendChild(li);
    }
  }

  if (styles.urls) {
    for (const [url, css] of Object.entries(styles.urls)) {
      const li = document.createElement('li');
      li.textContent = `URL: ${url} - Style: ${css.substring(0, 30)}...`;
      list.appendChild(li);
    }
  }
}

listStoredStyles();