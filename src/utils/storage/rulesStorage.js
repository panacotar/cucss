const RULES_KEY = "cucssRules";

// Example structure of stored rules:
// {
//   "cucssRules": {
//     "global": "...",
//     "hosts": {
//       "example.com": "..."
//     },
//     "urls": {
//       "example.com/page-one": "..."
//     }
//   }
// }

export { RULES_KEY };

export async function getRules() {
  const result = await browser.storage.local.get(RULES_KEY);
  return result[RULES_KEY] || {};
}

export async function saveRules(styles) {
  await browser.storage.local.set({ [RULES_KEY]: styles });
}

export async function setGlobalStyle(css) {
  const styles = await getRules();
  styles.global = css;
  await saveRules(styles);
}

export async function setHostStyle(host, css) {
  const styles = await getRules();
  styles.hosts = styles.hosts || {};
  styles.hosts[host] = css;
  await saveRules(styles);
}

export async function getHostStyle(host) {
  const styles = await getRules();
  return styles.hosts?.[host] || "";
}

export async function setUrlStyle(host, path, css) {
  const styles = await getRules();
  styles.urls = styles.urls || {};

  const normalizedPath = path.replace(/\/$/, "");
  const key = host + normalizedPath;

  styles.urls[key] = css;
  await saveRules(styles);
}

