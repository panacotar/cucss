import { HostFlagsStorage } from '../utils/storage.js';

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
      async remove(key) {
        delete this._data[key];
      },
      async clear() {
        this._data = {};
      }
    }
  }
};

describe('HostFlagsStorage', () => {
  beforeEach(async () => {
    await browser.storage.local.clear();
  });

  test('defaults to false when no host flag exists', async () => {
    expect(await HostFlagsStorage.getHostEnabled('example.com')).toBe(false);
  });

  test('falls back to legacy applyStyles when host flag missing', async () => {
    await browser.storage.local.set({ applyStyles: true });
    expect(await HostFlagsStorage.getHostEnabled('example.com')).toBe(true);
  });

  test('setHostEnabled writes host flag and removes legacy applyStyles', async () => {
    await browser.storage.local.set({ applyStyles: true });
    await HostFlagsStorage.setHostEnabled('example.com', false);

    const hostFlags = (await browser.storage.local.get(HostFlagsStorage.HOST_FLAGS_KEY))[HostFlagsStorage.HOST_FLAGS_KEY];
    expect(hostFlags).toEqual({ 'example.com': false });

    const legacy = (await browser.storage.local.get('applyStyles')).applyStyles;
    expect(legacy).toBeUndefined();
  });
});

