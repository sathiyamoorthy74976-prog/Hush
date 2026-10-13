import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  themePreference: ThemePreference;
  setThemePreference: (themePreference: ThemePreference) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: 'hush-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
