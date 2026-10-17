import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, space, useTheme } from '@/theme';

export function LoadingPill() {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: `${colors.bg}99` }]}>
      <View style={[styles.pill, { backgroundColor: colors.text }]}>
        <AppText variant="heading" tone="onInverse" style={styles.text}>··· Loading</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radii.pill,
  },
  text: { fontSize: 15 },
});
