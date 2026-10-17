import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { motion, radii, space, useReducedMotion, useTheme } from '@/theme';

function RadarRing({ delay, size }: { delay: number; size: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 0.35;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400 + delay }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1400 + delay }),
        withTiming(0.55, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [delay, opacity, reduceMotion, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        style,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: colors.brand,
        },
      ]}
    />
  );
}

export default function MatchingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const resetSession = useGameStore((s) => s.resetSession);

  useEffect(() => {
    resetSession();
    const t = setTimeout(() => router.replace('/match-found'), 1800);
    return () => clearTimeout(t);
  }, [resetSession, router]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={styles.radarWrap}>
          <RadarRing delay={0} size={200} />
          <RadarRing delay={200} size={160} />
          <RadarRing delay={400} size={120} />
          <View style={[styles.core, { backgroundColor: colors.brand }]}>
            <AppText variant="heading" style={{ color: colors.onBrand }}>⚡</AppText>
          </View>
        </View>
        <AppText variant="title">Finding someone…</AppText>
        <AppText tone="textSecondary" style={styles.sub}>
          Someone on campus, same energy window. Photo stays hidden until you chat.
        </AppText>
        <View style={[styles.safety, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <AppText variant="caption" tone="textSecondary" style={styles.safetyText}>
            Be kind. Don&apos;t share personal info.
          </AppText>
        </View>
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingHorizontal: space.md },
  radarWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
  },
  core: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub: { textAlign: 'center' },
  safety: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  safetyText: { textAlign: 'center' },
});
