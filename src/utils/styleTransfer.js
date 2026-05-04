// styleTransfer.js
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

