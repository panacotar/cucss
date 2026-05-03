// storage.test.js
// Jest test suite for Storage class
import { Storage } from '../utils/storage.js';

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
    await Storage.setGlobalStyle('body { color: red; }');
    const rules = await Storage.getRules();
    expect(rules.global).toBe('body { color: red; }');
  });

  test('should save and get host style', async () => {
    await Storage.setHostStyle('example.com', 'body { background: blue; }');
    const rules = await Storage.getRules();
    expect(rules.hosts['example.com']).toBe('body { background: blue; }');
    const hostStyle = await Storage.getHostStyle('example.com');
    expect(hostStyle).toBe('body { background: blue; }');
  });

  test('should save and get url style', async () => {
    await Storage.setUrlStyle('example.com', '/page', 'h1 { font-size: 2em; }');
    const rules = await Storage.getRules();
    expect(rules.urls['example.com/page']).toBe('h1 { font-size: 2em; }');
  });

  test('should overwrite existing styles', async () => {
    await Storage.setHostStyle('example.com', 'body { color: green; }');
    await Storage.setHostStyle('example.com', 'body { color: yellow; }');
    const hostStyle = await Storage.getHostStyle('example.com');
    expect(hostStyle).toBe('body { color: yellow; }');
  });

  test('should return empty string for missing host style', async () => {
    const hostStyle = await Storage.getHostStyle('notfound.com');
    expect(hostStyle).toBe('');
  });
});
