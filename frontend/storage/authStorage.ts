import { MMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

export const mmkv = new MMKV({
    id: 'auth-storage',
});

export const authStorage = createJSONStorage(() => ({
    getItem: (key: string) => {
        const value = mmkv.getString(key);
        return value ?? null;
    },
    setItem: (key: string, value: string) => {
        mmkv.set(key, value);
    },
    removeItem: (key: string) => {
        mmkv.delete(key);
    },
}));