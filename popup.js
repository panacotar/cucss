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

async function getApplyStyles() {
  const result = await browser.storage.local.get("applyStyles");
  return result["applyStyles"] || false;
}

let currentTab;

async function init() {
  // Query tabs to get current tab
  const [currentTab] = await browser.tabs.query({currentWindow: true, active:true});
  const currentHost = getCurrentHost(currentTab.url)
  // if (!currentHost) {

  // Set checkbox state based on stored value
  document.getElementById('styles-checkbox').checked = await getApplyStyles();

  // Set current host info
  document.getElementById('current-host').textContent = currentHost;

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
  // Store the checkbox state in local storage
  browser.storage.local.set({ "applyStyles": isChecked }).catch(onError);
});