import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme';
import type { TypeVariant } from '@/theme/typography';

type Tone =
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'brand'
  | 'onBrand'
  | 'onDanger'
  | 'danger'
  | 'success'
  | 'onGreen'
  | 'onOrange'
  | 'onGold';

type Props = TextProps & {
  variant?: TypeVariant;
  tone?: Tone;
};

export function AppText({ variant = 'body', tone = 'text', style, ...rest }: Props) {
  const { colors, typeScale } = useTheme();
  const color = tone === 'brand' ? colors.brandText : colors[tone];

  return <Text {...rest} style={[typeScale[variant], { color }, style]} />;
}
