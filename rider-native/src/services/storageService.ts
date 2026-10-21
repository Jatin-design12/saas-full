import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback if AsyncStorage is unavailable in certain environments
const memoryStore: Record<string, string> = {};

export const StorageService = {
  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      let raw: string | null = null;
      if (AsyncStorage) {
        raw = await AsyncStorage.getItem(key);
      } else {
        raw = memoryStore[key] || null;
      }
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return raw as unknown as T;
      }
    } catch (e) {
      console.warn(`StorageService.getItem error for key ${key}:`, e);
      return null;
    }
  },

  async setItem(key: string, value: any): Promise<boolean> {
    try {
      const stringified = typeof value === 'string' ? value : JSON.stringify(value);
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, stringified);
      }
      memoryStore[key] = stringified;
      return true;
    } catch (e) {
      console.warn(`StorageService.setItem error for key ${key}:`, e);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
      }
      delete memoryStore[key];
      return true;
    } catch (e) {
      console.warn(`StorageService.removeItem error for key ${key}:`, e);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      if (AsyncStorage) {
        await AsyncStorage.clear();
      }
      Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
      return true;
    } catch (e) {
      return false;
    }
  },
};
