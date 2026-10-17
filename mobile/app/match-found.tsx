import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, BlurAvatar } from '@/components/ui';
import { fonts, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

const MATCH_NAME = 'Rae';
const AVATAR_SIZE = 112;
const AVATAR_OVERLAP = 28;

function SparkBurst({ side }: { side: 'left' | 'right' }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: motion.match.sparkTwinkleMs / 2 }),
        withTiming(0.35, { duration: motion.match.sparkTwinkleMs / 2 }),
      ),
      -1,
      false,
    );
  }, [pulse, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.85 + pulse.value * 0.25 }],
  }));

  return (
    <Animated.View
      style={[
        styles.sparkCluster,
        side === 'left' ? styles.sparkLeft : styles.sparkRight,
        style,
      ]}
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.sparkLine,
            {
              backgroundColor: colors.brand,
              transform: [{ rotate: `${side === 'left' ? -28 + i * 14 : 28 - i * 14}deg` }],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

function MatchButton({
  label,
  variant,
  onPress,
  delayMs,
}: {
  label: string;
  variant: 'primary' | 'outline';
  onPress: () => void;
  delayMs: number;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    enter.value = withDelay(delayMs, withTiming(1, { duration: motion.fast }));
  }, [delayMs, enter]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 12 }, { scale: scale.value }],
  }));

  const onPressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(motion.match.buttonPressScale, motion.spring);
    }
  };

  const onPressOut = () => {
    scale.value = withSpring(1, motion.spring);
  };

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={wrapStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.actionButton,
          isPrimary
            ? { backgroundColor: colors.brand }
            : {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: colors.onScrim,
              },
        ]}
      >
        <AppText
          variant="heading"
          style={[
            styles.actionLabel,
            { color: isPrimary ? colors.text : colors.onScrim },
          ]}
        >
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export default function MatchFoundScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const { after } = useLocalSearchParams<{ after?: string }>();

  const overlay = useSharedValue(reduceMotion ? 1 : 0);
  const leftX = useSharedValue(reduceMotion ? 0 : -motion.match.avatarEnterOffset);
  const rightX = useSharedValue(reduceMotion ? 0 : motion.match.avatarEnterOffset);
  const heartScale = useSharedValue(reduceMotion ? 1 : 0);
  const heartPulse = useSharedValue(1);
  const titleEnter = useSharedValue(reduceMotion ? 1 : 0);
  const subtitleEnter = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    overlay.value = withTiming(1, { duration: motion.match.overlayFadeMs });
    leftX.value = withSpring(0, motion.spring);
    rightX.value = withSpring(0, motion.spring);

    heartScale.value = withDelay(
      motion.match.avatarMeetMs * 0.55,
      withSpring(1, motion.match.heartPopSpring),
    );

    let hapticTimer: ReturnType<typeof setTimeout> | undefined;
    if (!reduceMotion) {
      hapticTimer = setTimeout(() => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, motion.match.avatarMeetMs * 0.55 + 200);
      heartPulse.value = withDelay(
        motion.match.avatarMeetMs,
        withRepeat(
          withSequence(
            withTiming(motion.match.heartPulseScale, { duration: motion.match.heartPulseMs }),
            withTiming(1, { duration: motion.match.heartPulseMs }),
          ),
          -1,
          false,
        ),
      );
    }

    titleEnter.value = withDelay(
      motion.match.avatarMeetMs + motion.match.titleDelayMs,
      withTiming(1, { duration: motion.fast }),
    );
    subtitleEnter.value = withDelay(
      motion.match.avatarMeetMs + motion.match.titleDelayMs * 2,
      withTiming(1, { duration: motion.fast }),
    );

    return () => {
      if (hapticTimer) clearTimeout(hapticTimer);
    };
  }, [heartPulse, heartScale, leftX, overlay, reduceMotion, rightX, subtitleEnter, titleEnter]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: leftX.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: rightX.value }] }));
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value * heartPulse.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleEnter.value,
    transform: [{ translateY: (1 - titleEnter.value) * 10 }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleEnter.value,
    transform: [{ translateY: (1 - subtitleEnter.value) * 10 }],
  }));

  const onStartChat = () => {
    router.replace(after === 'waiting' ? '/waiting' : '/chat');
  };

  return (
    <View style={styles.root}>
      <View style={styles.backdrop} pointerEvents="none">
        <View style={[styles.backdropFill, { backgroundColor: colors.bg }]} />
        <BlurAvatar size={240} stage={0} />
      </View>

      <Animated.View
        style={[styles.scrim, overlayStyle, { backgroundColor: colors.scrim }]}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.body}>
          <Animated.View style={titleStyle}>
            <AppText variant="title" style={[styles.matchTitle, { color: colors.onScrim }]}>
              It&apos;s a Match!
            </AppText>
          </Animated.View>
          <Animated.View style={subtitleStyle}>
            <AppText style={[styles.matchSubtitle, { color: colors.onScrimMuted }]}>
              You and {MATCH_NAME} liked each other.
            </AppText>
          </Animated.View>

          <View style={styles.avatarStage}>
            <SparkBurst side="left" />
            <SparkBurst side="right" />
            <Animated.View style={[styles.avatarSlot, styles.avatarLeft, leftStyle]}>
              <View style={[styles.avatarRing, { borderColor: colors.onScrim }]}>
                <BlurAvatar size={AVATAR_SIZE} stage={5} />
              </View>
            </Animated.View>
            <Animated.View style={[styles.avatarSlot, styles.avatarRight, rightStyle]}>
              <View style={[styles.avatarRing, { borderColor: colors.onScrim }]}>
                <BlurAvatar size={AVATAR_SIZE} stage={5} />
              </View>
            </Animated.View>
            <Animated.View
              style={[
                styles.heartBadge,
                heartStyle,
                { backgroundColor: colors.bg, borderColor: colors.onScrim },
              ]}
            >
              <Ionicons name="heart" size={22} color={colors.brand} />
            </Animated.View>
          </View>

          <View style={styles.actions}>
            <MatchButton
              label="Start chat"
              variant="primary"
              delayMs={motion.match.avatarMeetMs + motion.match.buttonEnterDelayMs}
              onPress={onStartChat}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backdropFill: {
    ...StyleSheet.absoluteFill,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingTop: space.xl,
    alignItems: 'center',
    gap: space.sm,
  },
  matchTitle: {
    fontFamily: fonts.extraBold,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 38,
  },
  matchSubtitle: {
    fontFamily: fonts.regular,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  avatarStage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  avatarSlot: {
    position: 'absolute',
  },
  avatarLeft: {
    left: '50%',
    marginLeft: -(AVATAR_SIZE + AVATAR_OVERLAP / 2),
  },
  avatarRight: {
    left: '50%',
    marginLeft: -AVATAR_OVERLAP / 2,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: AVATAR_SIZE,
    padding: 3,
  },
  heartBadge: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sparkCluster: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkLeft: {
    left: '18%',
    top: '42%',
  },
  sparkRight: {
    right: '18%',
    top: '42%',
  },
  sparkLine: {
    position: 'absolute',
    width: 3,
    height: 14,
    borderRadius: radii.pill,
  },
  actions: {
    width: '100%',
    gap: space.xs,
    paddingBottom: space.md,
  },
  actionButton: {
    minHeight: 56,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  actionLabel: {
    fontSize: 17,
    lineHeight: 22,
  },
});
