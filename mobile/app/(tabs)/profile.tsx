import { useEffect, type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { HomeProgressSection } from '@/components/profile/HomeProgressSection';
import { AppText, Card, Chip, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { useProfileDraftStore } from '@/store/profileDraft';
import { fonts, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

const DAYS = Array.from({ length: 14 }, (_, i) => i < 6);
const AVATAR_SIZE = 96;
const BADGE_SIZE = 28;
const LOGOUT_HEIGHT = 56;

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type MenuItemConfig = {
  id: string;
  label: string;
  icon: IoniconName;
  onPress?: () => void;
};

const MENU_ITEMS: MenuItemConfig[] = [
  { id: 'edit', label: 'Edit Profile', icon: 'create-outline' },
  { id: 'preferences', label: 'My Preferences', icon: 'options-outline' },
  { id: 'privacy', label: 'Privacy & Safety', icon: 'lock-closed-outline' },
  { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
];

function ProfileMenuRow({
  label,
  icon,
  index,
  isLast,
  onPress,
}: {
  label: string;
  icon: IoniconName;
  index: number;
  isLast: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion ? 1 : 0);
  const highlight = useSharedValue(0);
  const chevronX = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      enter.value = 1;
      return;
    }
    enter.value = withDelay(
      index * motion.profile.menuRowStaggerMs,
      withTiming(1, { duration: motion.fast }),
    );
  }, [enter, index, reduceMotion]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * motion.profile.menuRowEnterOffset }],
    backgroundColor: interpolateColor(highlight.value, [0, 1], [colors.surface, colors.tint]),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: chevronX.value }],
  }));

  const onPressIn = () => {
    if (!reduceMotion) {
      highlight.value = withTiming(1, { duration: motion.profile.menuHighlightMs });
      chevronX.value = withTiming(motion.profile.menuChevronNudge, { duration: motion.fast });
    }
  };

  const onPressOut = () => {
    if (!reduceMotion) {
      highlight.value = withTiming(0, { duration: motion.profile.menuHighlightMs });
      chevronX.value = withSpring(0, motion.spring);
    }
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View style={rowStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.menuRowPressable}
      >
        <Ionicons name={icon} size={22} color={colors.text} />
        <AppText variant="body" style={styles.menuLabel}>{label}</AppText>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Animated.View>
      </Pressable>
      {!isLast && (
        <View style={[styles.menuDivider, { backgroundColor: colors.border, marginLeft: space.md }]} />
      )}
    </Animated.View>
  );
}

function LogOutButton({ onPress }: { onPress?: () => void }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(motion.profile.logoutPressScale, motion.spring);
    }
  };

  const onPressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, motion.spring);
    }
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.logoutButton, { backgroundColor: colors.surface }]}
      >
        <AppText variant="heading" style={styles.logoutLabel}>Log Out</AppText>
      </Pressable>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const { nickname, streak, xp, interests } = useGameStore();
  const profilePictureUri = useProfileDraftStore((s) => s.profilePictureUri);

  const avatarScale = useSharedValue(reduceMotion ? 1 : motion.profile.avatarEnterScale);
  const nameOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const nameTranslateY = useSharedValue(reduceMotion ? 0 : motion.profile.heroTextEnterOffset);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    avatarScale.value = withSpring(1, motion.spring);
    nameOpacity.value = withDelay(
      motion.profile.heroTextDelayMs,
      withTiming(1, { duration: motion.fast }),
    );
    nameTranslateY.value = withDelay(
      motion.profile.heroTextDelayMs,
      withTiming(0, { duration: motion.fast }),
    );
    badgeScale.value = withSequence(
      withTiming(motion.profile.editBadgePulse.scale, {
        duration: motion.profile.editBadgePulse.durationMs,
      }),
      withTiming(1, { duration: motion.profile.editBadgePulse.durationMs }),
    );
  }, [avatarScale, badgeScale, nameOpacity, nameTranslateY, reduceMotion]);

  const avatarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const heroTextStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }],
  }));

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const logoutHandler = undefined as (() => void) | undefined;

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppText variant="title">Profile</AppText>
        <View accessibilityLabel="Settings" accessibilityRole="image">
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </View>
      </View>

      <View style={styles.hero}>
        <Animated.View style={avatarAnimStyle}>
          <View style={styles.avatarOuter}>
            {profilePictureUri ? (
              <Image
                source={{ uri: profilePictureUri }}
                style={[
                  styles.avatar,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Ionicons name="person" size={40} color={colors.textMuted} />
              </View>
            )}
            <Animated.View
              style={[
                styles.editBadge,
                badgeAnimStyle,
                {
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="pencil" size={14} color={colors.text} />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.heroText, heroTextStyle]}>
          <AppText variant="title" style={styles.displayName}>{nickname}</AppText>
          <AppText tone="textMuted" style={styles.subtitle}>
            {xp} XP · campus verified
          </AppText>
        </Animated.View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
        {MENU_ITEMS.map((item, index) => (
          <ProfileMenuRow
            key={item.id}
            label={item.label}
            icon={item.icon}
            index={index}
            isLast={index === MENU_ITEMS.length - 1}
            onPress={item.onPress}
          />
        ))}
      </View>

      <LogOutButton onPress={logoutHandler} />

      <HomeProgressSection />

      <View style={styles.section}>
        <View style={styles.wrap}>
          <Chip label="First spark" selected />
          <Chip label="Streak 5" selected />
          <Chip label="Kind soul" selected />
        </View>
        <Card>
          <AppText variant="heading">🔥 {streak} day streak</AppText>
          <View style={styles.cal}>
            {DAYS.map((on, i) => (
              <View
                key={i}
                style={[
                  styles.day,
                  {
                    backgroundColor: on ? colors.brand : colors.disabledBg,
                    borderColor: colors.borderStrong,
                  },
                ]}
              />
            ))}
          </View>
        </Card>
        <AppText variant="caption">Interests</AppText>
        <View style={styles.wrap}>
          {interests.map((tag) => (
            <Chip key={tag} label={tag} selected />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  hero: {
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.md,
  },
  avatarOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontFamily: fonts.extraBold,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  menuCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: space.sm,
  },
  menuRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  menuLabel: {
    flex: 1,
    fontFamily: fonts.semiBold,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
  },
  logoutButton: {
    height: LOGOUT_HEIGHT,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  logoutLabel: {
    fontFamily: fonts.bold,
  },
  section: {
    gap: space.sm,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  cal: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  day: { width: 28, height: 28, borderRadius: radii.sm, borderWidth: 2 },
});
