import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { minTapTarget, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function NextProfileButton({ onPress, disabled }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const nudge = useSharedValue(0);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: nudge.value }],
  }));

  const handlePressIn = () => {
    if (reduceMotion || disabled) return;
    nudge.value = withTiming(-motion.discover.nextNudgePx, { duration: motion.fast });
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    nudge.value = withSpring(0, motion.spring);
  };

  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <View style={styles.col}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next profile"
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.btn,
          {
            backgroundColor: colors.tint,
            borderColor: colors.border,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        <Animated.View style={arrowStyle}>
          <Ionicons name="arrow-up" size={22} color={colors.text} />
        </Animated.View>
      </Pressable>
      <AppText variant="caption" tone="textMuted" style={styles.caption}>Next profile</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    width: minTapTarget,
    height: minTapTarget,
    borderRadius: minTapTarget / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 10,
    marginTop: -space.xxs,
  },
});
