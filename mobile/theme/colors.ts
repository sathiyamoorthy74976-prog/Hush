/** Bumble-inspired light palette: white surfaces, #FFC629 yellow accents, black type */
export const lightColors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  tint: '#FFF9E6',
  border: '#E8E8E8',
  borderStrong: '#CFCFCF',
  text: '#000000',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',
  brand: '#FFC629',
  brandPressed: '#E5B225',
  brandInk: '#000000',
  onBrand: '#000000',
  onInverse: '#FFFFFF',
  green: '#2FA36B',
  greenPressed: '#1E7A4D',
  onGreen: '#FFFFFF',
  orange: '#FFC629',
  orangePressed: '#E5B225',
  onOrange: '#000000',
  gold: '#FFC629',
  onGold: '#000000',
  blue: '#4C7CFF',
  purple: '#7B5CFF',
  danger: '#E53935',
  dangerPressed: '#C62828',
  onDanger: '#FFFFFF',
  success: '#2FA36B',
  warning: '#E5B225',
  disabledBg: '#F5F5F5',
  disabledText: '#BDBDBD',
};

export const darkColors = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceRaised: '#242424',
  tint: '#2A2410',
  border: '#333333',
  borderStrong: '#4A4A4A',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#8A8A8A',
  brand: '#FFC629',
  brandPressed: '#FFD95A',
  brandText: '#FFC629',
  onBrand: '#000000',
  onInverse: '#000000',
  green: '#3DC98A',
  greenPressed: '#2FA36B',
  onGreen: '#0F0F0F',
  orange: '#FFC629',
  orangePressed: '#FFD95A',
  onOrange: '#000000',
  gold: '#FFC629',
  onGold: '#000000',
  blue: '#7EA0FF',
  purple: '#A08BFF',
  danger: '#FF7A72',
  dangerPressed: '#E8645C',
  onDanger: '#0F0F0F',
  success: '#3DC98A',
  warning: '#FFD95A',
  disabledBg: '#262626',
  disabledText: '#6E6E6E',
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
      focusRing: c.brand,
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
