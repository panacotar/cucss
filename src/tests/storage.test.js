// storage.test.js
// Jest test suite for rules storage
import { RulesStorage } from '../utils/storage.js';

// Mock browser.storage.local
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

describe('Storage', () => {
  beforeEach(async () => {
    await browser.storage.local.clear();
  });

  test('should save and get global style', async () => {
    await RulesStorage.setGlobalStyle('body { color: red; }');
    const rules = await RulesStorage.getRules();
    expect(rules.global).toBe('body { color: red; }');
  });

  test('should save and get host style', async () => {
    await RulesStorage.setHostStyle('example.com', 'body { background: blue; }');
    const rules = await RulesStorage.getRules();
    expect(rules.hosts['example.com']).toBe('body { background: blue; }');
    const hostStyle = await RulesStorage.getHostStyle('example.com');
    expect(hostStyle).toBe('body { background: blue; }');
  });

  test('should save and get url style', async () => {
    await RulesStorage.setUrlStyle('example.com', '/page', 'h1 { font-size: 2em; }');
    const rules = await RulesStorage.getRules();
    expect(rules.urls['example.com/page']).toBe('h1 { font-size: 2em; }');
  });

  test('should overwrite existing styles', async () => {
    await RulesStorage.setHostStyle('example.com', 'body { color: green; }');
    await RulesStorage.setHostStyle('example.com', 'body { color: yellow; }');
    const hostStyle = await RulesStorage.getHostStyle('example.com');
    expect(hostStyle).toBe('body { color: yellow; }');
  });

  test('should return empty string for missing host style', async () => {
    const hostStyle = await RulesStorage.getHostStyle('notfound.com');
    expect(hostStyle).toBe('');
  });
});
