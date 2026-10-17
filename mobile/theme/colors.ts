/** Hush warm light palette: Cream/Sand surfaces, Honey accents, Ink type */
export const lightColors = {
  bg: '#FBF8F1',
  surface: '#F1ECE0',
  tint: '#F7F0E4',
  border: '#E2DCCB',
  borderStrong: '#C9C2B0',
  text: '#16161A',
  textSecondary: '#77746B',
  textMuted: '#77746B',
  brand: '#F7C948',
  brandPressed: '#E3B63A',
  brandInk: '#16161A',
  onBrand: '#16161A',
  onInverse: '#FBF8F1',
  accent: '#FF6B5E',
  accentPressed: '#E85A4E',
  green: '#5FA37A',
  greenPressed: '#4D8A66',
  onGreen: '#FBF8F1',
  orange: '#F7C948',
  orangePressed: '#E3B63A',
  onOrange: '#16161A',
  gold: '#F7C948',
  onGold: '#16161A',
  blue: '#4C7CFF',
  purple: '#7B5CFF',
  danger: '#D64545',
  dangerPressed: '#B83838',
  onDanger: '#FFFFFF',
  success: '#5FA37A',
  warning: '#E3B63A',
  disabledBg: '#F1ECE0',
  disabledText: '#77746B',
  scrim: 'rgba(22, 22, 26, 0.6)',
  onScrim: '#FFFFFF',
  onScrimMuted: 'rgba(255, 255, 255, 0.82)',
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
  accent: '#FF6B5E',
  accentPressed: '#E85A4E',
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
  scrim: 'rgba(0, 0, 0, 0.72)',
  onScrim: '#FFFFFF',
  onScrimMuted: 'rgba(255, 255, 255, 0.78)',
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
