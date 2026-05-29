import { HostFlagsStorage } from "./utils/storage.js";

function onError(error) {
  console.error(`Error: ${error}`);
}

function getCurrentHost(url) {
  if (!url) return "";

  try {
    const urlObject = new URL(url);
    return urlObject.host;
  } catch (e) {
    onError("Invalid URL:", url);
    return "";
  }
}

let currentTab;

async function init() {
  // Query tabs to get current tab
  [currentTab] = await browser.tabs.query({ currentWindow: true, active: true });
  const currentHost = getCurrentHost(currentTab.url)
  // if (!currentHost) {

  if (currentHost) {
    document.getElementById('invalid-host').style.display = 'none';
    document.getElementById('popup-form').style.display = 'block';
    // Set checkbox state based on stored value
    document.getElementById('styles-checkbox').checked = await HostFlagsStorage.getHostEnabled(currentHost);
  
    // Set current host info
    document.getElementById('current-host').textContent = currentHost;
  } else {
    document.getElementById('invalid-host').style.display = 'block';
    document.getElementById('popup-form').style.display = 'none';
  }

  // Open dashboard page
  document.getElementById('dashboard-btn').addEventListener('click', async () => {

    // URL encode current tab URL
    const encodedUrl = encodeURIComponent(currentTab.url || "");
    let creating = browser.tabs.create({
      url: "/dashboard.html?url-prefix=" + encodedUrl,
    });
    creating.catch(onError)
  });
}

init().catch(onError);


document.getElementById('styles-checkbox').addEventListener('change', (e) => {
  const isChecked = e.target.checked;
  if (!currentTab?.url) return;
  const currentHost = getCurrentHost(currentTab.url);
  if (!currentHost) return;
  HostFlagsStorage.setHostEnabled(currentHost, isChecked).catch(onError);
});
