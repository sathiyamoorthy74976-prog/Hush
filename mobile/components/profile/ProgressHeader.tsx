import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { radii, space, useTheme } from '@/theme';

type Props = {
  step: number;
  total: number;
  onBack: () => void;
};

export function ProgressHeader({ step, total, onBack }: Props) {
  const { colors } = useTheme();
  const clampedStep = Math.min(Math.max(step, 1), total);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <AppText variant="caption" tone="textSecondary" style={styles.label}>
          Step {clampedStep} of {total}
        </AppText>
        <View style={styles.backPlaceholder} />
      </View>
      <View style={styles.segments} accessibilityRole="progressbar">
        {Array.from({ length: total }, (_, i) => {
          const index = i + 1;
          const filled = index <= clampedStep;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  backgroundColor: filled ? colors.brand : colors.surface,
                  borderColor: filled ? colors.brand : colors.border,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {
    gap: space.xs,
    paddingBottom: space.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 40,
    alignItems: 'flex-start',
  },
  backPlaceholder: {
    width: 40,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
  segments: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
});

