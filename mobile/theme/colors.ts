export const lightColors = {
  bg: '#FFF6EC',
  surface: '#FFFFFF',
  tint: '#FFE8C8',
  border: '#E8D5BF',
  borderStrong: '#8A7360',
  text: '#1B140F',
  textSecondary: '#5C4F44',
  textMuted: '#5A4A3E',
  brand: '#C2185B',
  brandPressed: '#8E1143',
  brandInk: '#8E1143',
  onBrand: '#FFFFFF',
  green: '#2FA36B',
  greenPressed: '#1E7A4D',
  onGreen: '#FFFFFF',
  orange: '#F08A00',
  orangePressed: '#C46E00',
  onOrange: '#1B140F',
  gold: '#FFCF33',
  onGold: '#1B140F',
  blue: '#4C7CFF',
  purple: '#7B5CFF',
  danger: '#B4231C',
  dangerPressed: '#A8322C',
  onDanger: '#FFFFFF',
  success: '#2FA36B',
  warning: '#C46E00',
  disabledBg: '#EFE4D8',
  disabledText: '#9A8B7C',
};

export const darkColors = {
  bg: '#16110E',
  surface: '#241C17',
  surfaceRaised: '#2E241E',
  tint: '#3A2A20',
  border: '#4A3B32',
  borderStrong: '#8F7B6C',
  text: '#F6EEE6',
  textSecondary: '#C9B8A8',
  textMuted: '#A89484',
  brand: '#FF7A9C',
  brandPressed: '#FF9BB4',
  brandText: '#FFB0CC',
  onBrand: '#1B140F',
  green: '#3DC98A',
  greenPressed: '#2FA36B',
  onGreen: '#16110E',
  orange: '#FFB347',
  orangePressed: '#E08A1A',
  onOrange: '#16110E',
  gold: '#FFD86A',
  onGold: '#16110E',
  blue: '#7EA0FF',
  purple: '#A08BFF',
  danger: '#FF7A72',
  dangerPressed: '#E8645C',
  onDanger: '#16110E',
  success: '#3DC98A',
  warning: '#FFB347',
  disabledBg: '#2A221C',
  disabledText: '#8F7B6C',
};

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = ReturnType<typeof getThemeColors>;

export function getThemeColors(scheme: ColorScheme) {
  if (scheme === 'dark') {
    const c = darkColors;
    return {
      ...c,
      surfacePressed: c.surfaceRaised,
      brandHover: c.brand,
      brandInk: c.brandText,
      focusRing: c.brandText,
    };
  }
  const c = lightColors;
  return {
    ...c,
    surfaceRaised: c.surface,
    surfacePressed: c.tint,
    brandHover: c.brand,
    brandText: c.brandInk,
    focusRing: c.brand,
  };
}
