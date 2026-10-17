import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { minTapTarget, radii, space, useTheme } from '@/theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'green' | 'gold' | 'ghost' | 'danger' | 'orange';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  disabled?: boolean;
};

export function Button({ label, variant = 'primary', disabled, style, ...rest }: Props) {
  const { colors } = useTheme();

  const palette = {
    primary: { bg: colors.brand, edge: colors.brandPressed, text: 'onBrand' as const },
    green: { bg: colors.green, edge: colors.greenPressed, text: 'onGreen' as const },
    gold: { bg: colors.gold, edge: colors.orangePressed, text: 'onGold' as const },
    orange: { bg: colors.orange, edge: colors.orangePressed, text: 'onOrange' as const },
    ghost: { bg: colors.surface, edge: colors.borderStrong, text: 'text' as const },
    danger: { bg: colors.danger, edge: colors.dangerPressed, text: 'onDanger' as const },
  }[variant];

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={(state) => [
        styles.base,
        {
          backgroundColor: disabled ? colors.disabledBg : palette.bg,
          borderBottomColor: disabled ? colors.disabledText : palette.edge,
          borderBottomWidth: variant === 'ghost' ? (state.pressed || disabled ? 1 : 2) : state.pressed || disabled ? 2 : 4,
          transform: [{ translateY: state.pressed ? 2 : 0 }],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <AppText
        variant="heading"
        tone={disabled ? 'textMuted' : palette.text}
        style={{ fontSize: 16, lineHeight: 20, color: disabled ? colors.disabledText : undefined }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: minTapTarget,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

