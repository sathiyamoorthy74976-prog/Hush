import { useEffect, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, motion, useReducedMotion, useTheme } from '@/theme';

const HUSH_MARK = require('@/assets/logo/hush-mark.png');

function AnimatedTabLabel({ focused, children }: { focused: boolean; children: string }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.tabBar.crossFadeMs,
    });
  }, [focused, progress, reduceMotion]);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.textMuted, colors.brand]),
  }));

  return (
    <Animated.Text
      style={[
        styles.tabLabel,
        { fontFamily: fonts.bold, fontSize: motion.tabBar.labelSize },
        labelStyle,
      ]}
    >
      {children}
    </Animated.Text>
  );
}

function TabBarIcon({
  focused,
  active,
  inactive,
}: {
  focused: boolean;
  active: ReactNode;
  inactive: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(focused ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.tabBar.crossFadeMs,
    });

    if (focused && !reduceMotion) {
      scale.value = 1;
      scale.value = withSequence(
        withSpring(1.15, motion.tabBar.iconBounce),
        withSpring(1, motion.tabBar.iconBounce),
      );
    } else if (!focused) {
      scale.value = 1;
    }
  }, [focused, progress, reduceMotion, scale]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  const size = motion.tabBar.iconSize;

  return (
    <Animated.View style={[styles.iconSlot, { width: size, height: size }, wrapStyle]}>
      <Animated.View style={[styles.iconLayer, inactiveStyle]}>{inactive}</Animated.View>
      <Animated.View style={[styles.iconLayer, activeStyle]}>{active}</Animated.View>
    </Animated.View>
  );
}

function DiscoverIcons({ focused }: { focused: boolean }) {
  const { colors } = useTheme();
  const size = motion.tabBar.iconSize;

  return (
    <TabBarIcon
      focused={focused}
      active={
        <Image
          source={HUSH_MARK}
          style={{ width: size, height: size }}
          tintColor={colors.brand}
          contentFit="contain"
        />
      }
      inactive={
        <Ionicons name="compass-outline" size={size} color={colors.textMuted} />
      }
    />
  );
}

function IonTabIcon({
  focused,
  activeName,
  inactiveName,
}: {
  focused: boolean;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();
  const size = motion.tabBar.iconSize;

  return (
    <TabBarIcon
      focused={focused}
      active={<Ionicons name={activeName} size={size} color={colors.brand} />}
      inactive={<Ionicons name={inactiveName} size={size} color={colors.textMuted} />}
    />
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarButton: ({
          children,
          onPress,
          onLongPress,
          style,
          accessibilityRole,
          accessibilityState,
          accessibilityLabel,
          testID,
        }) => (
          <Pressable
            accessibilityRole={accessibilityRole}
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            style={style}
            onLongPress={onLongPress}
            onPress={(event) => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPress?.(event);
            }}
          >
            {children}
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopLeftRadius: motion.tabBar.topRadius,
          borderTopRightRadius: motion.tabBar.topRadius,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          borderColor: colors.border,
          paddingTop: 8,
          paddingBottom: bottomPad,
          height: 56 + bottomPad,
          ...Platform.select({
            ios: {
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
            },
            android: { elevation: 12 },
            default: {},
          }),
        },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: motion.tabBar.labelSize },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarLabel: ({ focused, children }) => (
            <AnimatedTabLabel focused={focused}>{String(children)}</AnimatedTabLabel>
          ),
          tabBarIcon: ({ focused }) => <DiscoverIcons focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="league"
        options={{
          title: 'Matches',
          tabBarLabel: ({ focused, children }) => (
            <AnimatedTabLabel focused={focused}>{String(children)}</AnimatedTabLabel>
          ),
          tabBarIcon: ({ focused }) => (
            <IonTabIcon focused={focused} activeName="heart" inactiveName="heart-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarLabel: ({ focused, children }) => (
            <AnimatedTabLabel focused={focused}>{String(children)}</AnimatedTabLabel>
          ),
          tabBarIcon: ({ focused }) => (
            <IonTabIcon focused={focused} activeName="chatbubble" inactiveName="chatbubble-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: ({ focused, children }) => (
            <AnimatedTabLabel focused={focused}>{String(children)}</AnimatedTabLabel>
          ),
          tabBarIcon: ({ focused }) => (
            <IonTabIcon focused={focused} activeName="person" inactiveName="person-outline" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    marginTop: 2,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
