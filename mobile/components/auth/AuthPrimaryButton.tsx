import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { minTapTarget, radii, space } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthPrimaryButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={(state) => [
        styles.base,
        disabled && styles.disabled,
        state.pressed && !disabled && styles.pressed,
      ]}
    >
      <AppText variant="heading" tone="onInverse" style={styles.label}>
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
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
  disabled: { backgroundColor: '#BDBDBD' },
  label: { fontSize: 16, lineHeight: 20 },
});
