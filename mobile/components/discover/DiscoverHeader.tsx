import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { minTapTarget, motion, space, useReducedMotion, useTheme } from '@/theme';

const WORDMARK = require('@/assets/logo/hush-wordmark.png');
const MARK = require('@/assets/logo/hush-mark.png');

type Props = {
  hasNewLikes: boolean;
  onFilterPress: () => void;
  onNotificationsPress: () => void;
};

export function DiscoverHeader({ hasNewLikes, onFilterPress, onNotificationsPress }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const dotScale = useSharedValue(1);

  useEffect(() => {
    if (!hasNewLikes || reduceMotion) return;
    dotScale.value = withSequence(
      withTiming(1.35, { duration: motion.discover.headerNotifPulseMs / 2 }),
      withTiming(1, { duration: motion.discover.headerNotifPulseMs / 2 }),
    );
  }, [dotScale, hasNewLikes, reduceMotion]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <View style={styles.row}>
      <View style={styles.brand} accessibilityRole="header">
        <Image source={MARK} style={styles.mark} contentFit="contain" />
        <Image source={WORDMARK} style={styles.wordmark} contentFit="contain" />
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filters"
          onPress={onFilterPress}
          style={[styles.iconBtn, { backgroundColor: colors.tint, borderColor: colors.border }]}
        >
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationsPress}
          style={[styles.iconBtn, { backgroundColor: colors.tint, borderColor: colors.border }]}
        >
          <Ionicons name="heart-outline" size={22} color={colors.text} />
          {hasNewLikes ? (
            <Animated.View
              style={[styles.dot, dotStyle, { backgroundColor: colors.accent }]}
            />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    minHeight: minTapTarget,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mark: {
    width: 28,
    height: 28,
  },
  wordmark: {
    width: 72,
    height: 28,
  },
  actions: {
    flexDirection: 'row',
    gap: space.xs,
  },
  iconBtn: {
    width: minTapTarget,
    height: minTapTarget,
    borderRadius: minTapTarget / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
