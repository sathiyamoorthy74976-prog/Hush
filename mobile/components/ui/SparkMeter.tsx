import { Pressable, StyleSheet, View } from 'react-native';

import { SPARK_STAGES } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  stage: number;
  onPress?: () => void;
};

export function SparkMeter({ stage, onPress }: Props) {
  const { colors } = useTheme();
  const pct = (stage / SPARK_STAGES) * 100;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="adjustable"
      accessibilityLabel={`Spark stage ${stage} of ${SPARK_STAGES}. Tap to reveal more.`}
      style={styles.wrap}
    >
      <View style={styles.head}>
        <AppText variant="caption">Spark</AppText>
        <AppText variant="caption" tone="brand">
          Stage {stage}/{SPARK_STAGES}
        </AppText>
      </View>
      <View style={[styles.track, { backgroundColor: colors.disabledBg, borderColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct}%`, backgroundColor: colors.gold, borderColor: colors.orangePressed },
          ]}
        />
        <View style={styles.markers} pointerEvents="none">
          {Array.from({ length: SPARK_STAGES }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i < stage ? colors.orange : colors.surface,
                  borderColor: colors.text,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  track: {
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRightWidth: 2,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
});
