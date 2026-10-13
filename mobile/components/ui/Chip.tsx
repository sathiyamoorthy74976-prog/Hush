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
          backgroundColor: selected ? colors.tint : colors.surface,
          borderColor: selected ? colors.brand : colors.border,
          borderBottomColor: selected ? colors.brandPressed : colors.borderStrong,
          borderBottomWidth: pressed ? 2 : 4,
          transform: [{ translateY: pressed ? 2 : 0 }],
        },
      ]}
    >
      <AppText variant="caption" tone={selected ? 'brand' : 'textSecondary'}>
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
