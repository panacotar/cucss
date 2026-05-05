// Utilities for exporting and importing user styles as JSON
import { Storage } from './storage.js';

/**
 * Exports all user styles as a downloadable JSON file.
 * The structure matches the Storage rules format.
 */
export async function exportStyles() {
  const rules = await Storage.getRules();
  const dataStr = JSON.stringify(rules, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'cucss_rules.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports user styles from a JSON file (File object).
 * Overwrites all existing styles.
 * @param {File} file - The JSON file to import
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function importStyles(file) {
  try {
    const text = await file.text();
    const rules = JSON.parse(text);
    // Basic validation
    if (typeof rules !== 'object' || (!rules.global && !rules.hosts && !rules.urls)) {
      return { success: false, error: 'Invalid file structure.' };
    }
    await Storage.saveRules(rules);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
