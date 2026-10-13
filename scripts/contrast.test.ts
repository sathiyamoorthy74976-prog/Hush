import { describe, expect, it } from 'vitest';

import { darkColors, lightColors } from '../mobile/theme/colors';
import { contrastRatio } from './contrast';

type Pair = { fg: string; bg: string; min: number; name: string };

function pairsForLight(): Pair[] {
  const c = lightColors;
  const surfaces = [
    ['bg', c.bg],
    ['surface', c.surface],
    ['tint', c.tint],
  ] as const;
  const text = [
    ['text', c.text],
    ['textSecondary', c.textSecondary],
    ['textMuted', c.textMuted],
  ] as const;

  const pairs: Pair[] = [];
  for (const [tName, t] of text) {
    for (const [sName, s] of surfaces) {
      pairs.push({ fg: t, bg: s, min: 4.5, name: `light ${tName} on ${sName}` });
    }
  }

  pairs.push(
    { fg: c.onBrand, bg: c.brand, min: 4.5, name: 'light onBrand on brand' },
    { fg: c.onBrand, bg: c.brandPressed, min: 4.5, name: 'light onBrand on brandPressed' },
    { fg: c.onDanger, bg: c.danger, min: 4.5, name: 'light onDanger on danger' },
    { fg: c.brandInk, bg: c.tint, min: 4.5, name: 'light brandInk on tint' },
    { fg: c.borderStrong, bg: c.bg, min: 3, name: 'light borderStrong on bg' },
    { fg: c.borderStrong, bg: c.surface, min: 3, name: 'light borderStrong on surface' },
    { fg: c.brand, bg: c.bg, min: 3, name: 'light brand on bg (icons)' },
  );

  return pairs;
}

function pairsForDark(): Pair[] {
  const c = darkColors;
  const surfaces = [
    ['bg', c.bg],
    ['surface', c.surface],
    ['tint', c.tint],
    ['surfaceRaised', c.surfaceRaised],
  ] as const;
  const text = [
    ['text', c.text],
    ['textSecondary', c.textSecondary],
    ['textMuted', c.textMuted],
  ] as const;

  const pairs: Pair[] = [];
  for (const [tName, t] of text) {
    for (const [sName, s] of surfaces) {
      pairs.push({ fg: t, bg: s, min: 4.5, name: `dark ${tName} on ${sName}` });
    }
  }

  pairs.push(
    { fg: c.onBrand, bg: c.brand, min: 4.5, name: 'dark onBrand on brand' },
    { fg: c.onBrand, bg: c.brandPressed, min: 4.5, name: 'dark onBrand on brandPressed' },
    { fg: c.onDanger, bg: c.danger, min: 4.5, name: 'dark onDanger on danger' },
    { fg: c.brandText, bg: c.bg, min: 4.5, name: 'dark brandText on bg' },
    { fg: c.brandText, bg: c.surface, min: 4.5, name: 'dark brandText on surface' },
    { fg: c.brandText, bg: c.tint, min: 4.5, name: 'dark brandText on tint' },
    { fg: c.borderStrong, bg: c.bg, min: 3, name: 'dark borderStrong on bg' },
    { fg: c.borderStrong, bg: c.surface, min: 3, name: 'dark borderStrong on surface' },
    { fg: c.brandText, bg: c.bg, min: 3, name: 'dark brandText on bg (icons)' },
  );

  return pairs;
}

describe('contrast tokens', () => {
  it('meets WCAG ratios for light and dark palettes', () => {
    const failures: string[] = [];
    for (const pair of [...pairsForLight(), ...pairsForDark()]) {
      const ratio = contrastRatio(pair.fg, pair.bg);
      if (ratio < pair.min) {
        failures.push(
          `${pair.name}: ${ratio.toFixed(2)} < ${pair.min} (${pair.fg} on ${pair.bg})`,
        );
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
});
