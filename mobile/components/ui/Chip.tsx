import { Pressable, StyleSheet } from 'react-native';

import { minTapTarget, radii, space, useTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? colors.brand : colors.surface,
          borderColor: selected ? colors.brandPressed : colors.border,
          borderBottomColor: selected ? colors.brandPressed : colors.borderStrong,
          borderBottomWidth: pressed ? 1 : 2,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
      ]}
    >
      <AppText variant="caption" tone={selected ? 'onBrand' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: minTapTarget,
    paddingHorizontal: space.sm,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});

