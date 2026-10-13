import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radii, space, useTheme } from '@/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  tint?: boolean;
};

export function Card({ children, style, tint }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: tint ? colors.tint : colors.surface,
          borderColor: colors.border,
          borderBottomColor: colors.borderStrong,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radii.lg,
    padding: space.sm,
    gap: space.xs,
  },
});
