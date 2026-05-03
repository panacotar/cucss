const RULES_KEY = "styleRules";

// Example structure of stored rules:
// {
//   "styleRules": {
//     "global": "...",
//     "hosts": {
//       "example.com": "..."
//     },
//     "urls": {
//       "example.com/page-one": "..."
//     }
//   }
// }

export class Storage {
  static get RULES_KEY() {
    return RULES_KEY;
  }

  // static async setValue(key, value) {
  //   await browser.storage.local.set({ [key]: value });
  // }

  // static async getValue(key) {
  //   const result = await browser.storage.local.get(key);
  //   return result[key];
  // }

  static async getRules() {
    const result = await browser.storage.local.get(this.RULES_KEY);
    return result[this.RULES_KEY] || {};
  }

  static async saveRules(styles) {
    await browser.storage.local.set({ [this.RULES_KEY]: styles });
  }

  static async setGlobalStyle(css) {
    const styles = await this.getRules();
    styles.global = css;
    await this.saveRules(styles);
  }

  static async setHostStyle(host, css) {
    const styles = await this.getRules();
    styles.hosts = styles.hosts || {};
    styles.hosts[host] = css;
    await this.saveRules(styles);
  }

  static async getHostStyle(host) {
    const styles = await this.getRules();
    return styles.hosts?.[host] || "";
  }

  static async setUrlStyle(host, path, css) {
    const styles = await this.getRules();
    styles.urls = styles.urls || {};

    const normalizedPath = path.replace(/\/$/, "");
    const key = host + normalizedPath;

    styles.urls[key] = css;
    await this.saveRules(styles);
  }
}