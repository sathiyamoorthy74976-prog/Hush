import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { minTapTarget, radii, space, useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableOptionCard({ title, subtitle, emoji, selected, onPress }: Props) {
  const { colors } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? colors.tint : colors.surface,
          borderColor: selected ? colors.brand : colors.border,
          borderBottomColor: selected ? colors.brand : colors.borderStrong,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {emoji ? (
        <AppText style={styles.emoji}>{emoji}</AppText>
      ) : null}
      <View style={styles.text}>
        <AppText variant="heading">{title}</AppText>
        <AppText tone="textSecondary" variant="caption">{subtitle}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTapTarget,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radii.lg,
    padding: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
