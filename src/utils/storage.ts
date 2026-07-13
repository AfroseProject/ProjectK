import { MMKV } from 'react-native-mmkv';

// @ts-ignore
export const storage = new MMKV();

export const cacheData = (key: string, value: any) => {
  storage.set(key, JSON.stringify(value));
};

export const getCachedData = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (value) {
    return JSON.parse(value) as T;
  }
  return null;
};
