import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import type { DiscoverProfile } from '@/types/discover';
import { fonts, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  profile: DiscoverProfile;
  height: number;
  isActive: boolean;
};

export function ProfileCard({ profile, height, isActive }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const [blurRadius, setBlurRadius] = useState<number>(
    isActive ? motion.discover.photoBlurEnd : motion.discover.photoBlurStart,
  );
  const tickScale = useSharedValue(reduceMotion ? 1 : 0.6);

  useEffect(() => {
    if (!isActive) return;
    if (reduceMotion) {
      setBlurRadius(motion.discover.photoBlurEnd);
    } else {
      setBlurRadius(motion.discover.photoBlurStart);
      const start = Date.now();
      const duration = motion.discover.blurEaseMs;
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const next =
          motion.discover.photoBlurStart +
          (motion.discover.photoBlurEnd - motion.discover.photoBlurStart) * t;
        setBlurRadius(next);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    if (!reduceMotion && profile.verified) {
      tickScale.value = withSpring(1, motion.spring);
    } else if (profile.verified) {
      tickScale.value = 1;
    }
  }, [isActive, profile.id, profile.verified, reduceMotion, tickScale]);

  const tickStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tickScale.value }],
  }));

  const photoHeight = Math.round(height * 0.62);

  return (
    <View style={[styles.card, { height, backgroundColor: colors.bg }]}>
      <View style={[styles.photoWrap, { height: photoHeight, borderColor: colors.border }]}>
        <Image
          source={{ uri: profile.photoUri }}
          style={StyleSheet.absoluteFill}
          blurRadius={blurRadius}
        />
        <View style={[styles.lockPill, { backgroundColor: colors.bg, opacity: 0.92 }]}>
          <Ionicons name="lock-closed" size={14} color={colors.text} />
          <AppText variant="caption" style={styles.lockText}>Reveal as you chat</AppText>
        </View>
        <View style={[styles.infoPanel, { backgroundColor: colors.bg }]}>
          <View style={styles.nameRow}>
            <AppText variant="heading" style={styles.name}>
              {profile.name}, {profile.age}
            </AppText>
            {profile.verified ? (
              <Animated.View style={tickStyle}>
                <Ionicons name="checkmark-circle" size={20} color={colors.green} />
              </Animated.View>
            ) : null}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <AppText variant="caption" tone="textMuted">
              {profile.locationLabel} · {profile.distanceKm} km away
            </AppText>
          </View>
          <View style={styles.chips}>
            {profile.interests.map((interest, index) => (
              <InterestChip
                key={interest.id}
                label={interest.label}
                icon={interest.icon}
                index={index}
                animate={isActive}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function InterestChip({
  label,
  icon,
  index,
  animate,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  index: number;
  animate: boolean;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion || !animate ? 1 : 0);

  useEffect(() => {
    if (!animate || reduceMotion) {
      enter.value = 1;
      return;
    }
    enter.value = 0;
    enter.value = withDelay(
      index * motion.discover.chipStaggerMs,
      withSpring(1, motion.spring),
    );
  }, [animate, enter, index, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.85 + enter.value * 0.15 }],
  }));

  return (
    <Animated.View style={style}>
      <View style={[styles.interestChip, { backgroundColor: colors.tint, borderColor: colors.border }]}>
        <Ionicons name={icon} size={14} color={colors.text} />
        <AppText variant="caption">{label}</AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  photoWrap: {
    flex: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  lockPill: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  lockText: {
    fontFamily: fonts.semiBold,
  },
  infoPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.sm,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    gap: 6,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: fonts.extraBold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: 4,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
