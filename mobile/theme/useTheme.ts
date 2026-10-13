import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings';

import { getThemeColors, type ColorScheme, type ThemeColors } from './colors';
import { motion } from './motion';
import { radii } from './radii';
import { minTapTarget, space } from './spacing';
import { fonts, typeScale } from './typography';
import { useReducedMotion } from './useReducedMotion';

export function useTheme() {
  const system = useColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const reduceMotion = useReducedMotion();

  const scheme: ColorScheme =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const colors: ThemeColors = getThemeColors(scheme);

  return {
    scheme,
    preference,
    setThemePreference,
    colors,
    space,
    radii,
    fonts,
    typeScale,
    motion,
    reduceMotion,
    minTapTarget,
  };
}

export type Theme = ReturnType<typeof useTheme>;
