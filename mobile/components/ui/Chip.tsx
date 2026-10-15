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
          backgroundColor: selected ? colors.text : colors.surface,
          borderColor: selected ? colors.text : colors.border,
          borderBottomColor: selected ? colors.text : colors.borderStrong,
          borderBottomWidth: pressed ? 1 : 2,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
      ]}
    >
      <AppText variant="caption" tone={selected ? 'onInverse' : 'text'}>
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
