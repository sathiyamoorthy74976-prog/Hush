import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  height: number;
};

export function FeedSkeleton({ height }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    shimmer.value = withRepeat(
      withTiming(1, { duration: motion.matchesList.shimmerMs }),
      -1,
      false,
    );
  }, [reduceMotion, shimmer]);

  const sheenStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-200, 280]),
      },
    ],
  }));

  const photoH = Math.round(height * 0.55);

  return (
    <View style={[styles.wrap, { height }]}>
      <View style={[styles.photo, { height: photoH, backgroundColor: colors.surface }]}>
        <Animated.View
          style={[
            styles.sheen,
            sheenStyle,
            { backgroundColor: colors.tint },
          ]}
        />
      </View>
      <View style={[styles.prompt, { backgroundColor: colors.surface }]}>
        <View style={[styles.line, { width: '40%', backgroundColor: colors.tint }]} />
        <View style={[styles.line, { width: '90%', backgroundColor: colors.tint }]} />
        <View style={[styles.line, { width: '70%', backgroundColor: colors.tint }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    paddingHorizontal: space.sm,
  },
  photo: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    opacity: 0.5,
  },
  prompt: {
    flex: 1,
    borderRadius: radii.lg,
    padding: space.sm,
    gap: space.xs,
    overflow: 'hidden',
  },
  line: {
    height: 14,
    borderRadius: radii.sm,
  },
});
