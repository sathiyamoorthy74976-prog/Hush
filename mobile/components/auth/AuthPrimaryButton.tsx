import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { minTapTarget, radii, space, useTheme } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthPrimaryButton({ label, onPress, disabled }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={(state) => [
        styles.base,
        {
          backgroundColor: disabled ? colors.disabledBg : colors.text,
        },
        state.pressed && !disabled && styles.pressed,
      ]}
    >
      <AppText
        variant="heading"
        tone={disabled ? 'textMuted' : 'onInverse'}
        style={styles.label}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: minTapTarget,
    paddingVertical: 14,
    paddingHorizontal: space.md,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
  label: { fontSize: 16, lineHeight: 20 },
});
