import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  message: string | null;
  onHidden: () => void;
};

export function DiscoverToast({ message, onHidden }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    if (!message) return;
    opacity.value = withTiming(1, { duration: reduceMotion ? 0 : motion.fast });
    translateY.value = withTiming(0, { duration: reduceMotion ? 0 : motion.fast });
    const t = setTimeout(() => {
      opacity.value = withTiming(0, { duration: motion.fast }, (finished) => {
        if (finished) runOnJS(onHidden)();
      });
      translateY.value = withTiming(12, { duration: motion.fast });
    }, motion.discover.toastMs);
    return () => clearTimeout(t);
  }, [message, onHidden, opacity, reduceMotion, translateY]);

  if (!message) return null;

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.toast,
        style,
        { backgroundColor: colors.text, shadowColor: colors.text },
      ]}
      accessibilityLiveRegion="polite"
    >
      <AppText variant="caption" style={{ color: colors.onInverse, textAlign: 'center' }}>
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: space.sm,
    right: space.sm,
    bottom: 120,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radii.pill,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
});
