import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { fonts, minTapTarget, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  onPress: () => void;
};

export function GoLiveButton({ onPress }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const dotScale = useSharedValue(1);
  const glow = useSharedValue<number>(motion.discover.goLiveGlowOpacity);

  useEffect(() => {
    if (reduceMotion) return;
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: motion.discover.livePulseMs / 2 }),
        withTiming(1, { duration: motion.discover.livePulseMs / 2 }),
      ),
      -1,
      false,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(motion.discover.goLiveGlowOpacity, { duration: motion.discover.livePulseMs / 2 }),
        withTiming(motion.discover.goLiveGlowOpacity * 0.5, { duration: motion.discover.livePulseMs / 2 }),
      ),
      -1,
      false,
    );
  }, [dotScale, glow, reduceMotion]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const onPressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(motion.discover.goLivePressScale, motion.spring);
    }
  };

  const onPressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, motion.spring);
    }
  };

  return (
    <Animated.View style={[styles.wrap, btnStyle]}>
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          { backgroundColor: colors.brand, shadowColor: colors.brand },
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go Live. Chat with someone random"
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.pill, { backgroundColor: colors.brand, borderColor: colors.brandPressed }]}
      >
        <Animated.View style={[styles.liveDot, dotStyle, { backgroundColor: colors.danger }]} />
        <Ionicons name="flash" size={20} color={colors.onBrand} />
        <View style={styles.textCol}>
          <AppText variant="heading" style={{ fontFamily: fonts.extraBold, color: colors.onBrand }}>
            Go Live
          </AppText>
          <AppText variant="caption" style={{ color: colors.onBrand, opacity: 0.85 }}>
            Chat with someone random
          </AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: minTapTarget,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.pill,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingVertical: 12,
    borderRadius: radii.pill,
    borderWidth: 2,
    minHeight: minTapTarget,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
