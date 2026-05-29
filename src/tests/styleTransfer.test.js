import { jest } from '@jest/globals';
import { exportStyles, importStyles } from '../utils/styleTransfer.js';
import { RulesStorage } from '../utils/storage.js';

// Mock browser.storage.local (same pattern as storage.test.js)
global.browser = {
  storage: {
    local: {
      _data: {},
      async get(key) {
        if (typeof key === 'string') {
          return { [key]: this._data[key] };
        }
        return {};
      },
      async set(obj) {
        Object.assign(this._data, obj);
      },
      async clear() {
        this._data = {};
      }
    }
  }
};

describe('styleTransfer', () => {
  beforeEach(async () => {
    await browser.storage.local.clear();
    global.document = undefined;
    jest.restoreAllMocks();
  });

  describe('exportStyles', () => {
    test('exports current rules as a downloadable JSON file', async () => {
      const rules = {
        global: 'body { color: red; }',
        hosts: { 'example.com': 'body { background: blue; }' },
        urls: { 'example.com/page': 'h1 { font-size: 2em; }' }
      };
      await RulesStorage.saveRules(rules);

      const anchor = {
        tagName: 'A',
        href: '',
        download: '',
        click: jest.fn()
      };

      const createObjectURL = jest.fn(() => 'blob:mock');
      const revokeObjectURL = jest.fn();
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const appendChild = jest.fn();
      const removeChild = jest.fn();
      global.document = {
        body: { appendChild, removeChild },
        createElement: jest.fn((tagName) => {
          if (tagName !== 'a') throw new Error(`Unexpected tag: ${tagName}`);
          return anchor;
        })
      };

      await exportStyles();

      expect(createObjectURL).toHaveBeenCalledTimes(1);
      const blobArg = createObjectURL.mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg.type).toBe('application/json');

      // Triggering export styles should click and then cleanup.
      expect(anchor.tagName).toBe('A');
      expect(anchor.href).toBe('blob:mock');
      expect(anchor.download).toBe('cucss_rules.json');

      // click() is invoked inside exportStyles after the element is appended.
      expect(appendChild).toHaveBeenCalledWith(anchor);
      expect(anchor.click).toHaveBeenCalledTimes(1);
      expect(removeChild).toHaveBeenCalledWith(anchor);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    });
  });

  describe('importStyles', () => {
    test('imports valid rules JSON and overwrites existing styles', async () => {
      await RulesStorage.setGlobalStyle('body { color: green; }');

      const importedRules = {
        global: 'body { color: red; }',
        hosts: { 'example.com': 'body { background: blue; }' },
        urls: { 'example.com/page': 'h1 { font-size: 2em; }' }
      };

      const file = {
        async text() {
          return JSON.stringify(importedRules);
        }
      };

      const result = await importStyles(file);
      expect(result).toEqual({ success: true });

      const stored = await RulesStorage.getRules();
      expect(stored).toEqual(importedRules);
    });

    test('rejects JSON with invalid structure', async () => {
      const file = {
        async text() {
          return JSON.stringify({ foo: 'bar' });
        }
      };

      const result = await importStyles(file);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid file structure.');

      const stored = await RulesStorage.getRules();
      expect(stored).toEqual({});
    });

    test('rejects invalid JSON with a parse error', async () => {
      const file = {
        async text() {
          return '{ not valid json';
        }
      };

      const result = await importStyles(file);
      expect(result.success).toBe(false);
      expect(typeof result.error).toBe('string');
      expect(result.error.length).toBeGreaterThan(0);
    });
  });
});
