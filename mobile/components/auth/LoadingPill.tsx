import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, space } from '@/theme';

export function LoadingPill() {
  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
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
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  pill: {
    backgroundColor: '#000000',
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radii.pill,
  },
  text: { fontSize: 15 },
});
