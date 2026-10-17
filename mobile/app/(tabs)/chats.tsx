import { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText, BlurAvatar, Screen } from '@/components/ui';
import { fonts, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

const ROWS = [
  { name: 'Rae', preview: 'mutual — this one stays', stage: 5, timer: null as string | null },
  { name: '???', preview: 'spark 3 — photo still foggy', stage: 3, timer: '02:14:08' },
  { name: '???', preview: 'icebreaker hanging', stage: 1, timer: '11:02:40' },
];

const SEGMENTS = ['All', 'New', 'Messages'] as const;
const AVATAR_SIZE = 64;
const AVATAR_GAP = space.sm;
const ROW_INSET = AVATAR_SIZE + AVATAR_GAP;

type Row = (typeof ROWS)[number];
type Segment = (typeof SEGMENTS)[number];

/** No async load hook on this screen yet — skeleton UI is ready when loading is wired. */
const IS_LOADING = false;

function SegmentFilter({
  value,
  onChange,
}: {
  value: Segment;
  onChange: (segment: Segment) => void;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = useSharedValue(SEGMENTS.indexOf(value));

  useEffect(() => {
    const index = SEGMENTS.indexOf(value);
    activeIndex.value = withTiming(index, {
      duration: reduceMotion ? 0 : motion.matchesList.segmentSlideMs,
    });
  }, [activeIndex, reduceMotion, value]);

  const pillWidth = trackWidth > 0 ? (trackWidth - 8) / SEGMENTS.length : 0;

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndex.value * pillWidth }],
    width: pillWidth,
  }));

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.segmentTrack, { backgroundColor: colors.surface }]}
      onLayout={onTrackLayout}
    >
      {pillWidth > 0 && (
        <Animated.View
          style={[
            styles.segmentHighlight,
            { backgroundColor: colors.brand },
            highlightStyle,
          ]}
        />
      )}
      {SEGMENTS.map((label) => {
        const selected = value === label;
        return (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(label)}
            style={styles.segmentPill}
          >
            <AppText
              variant="caption"
              tone={selected ? 'text' : 'textMuted'}
              style={styles.segmentLabel}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function ShimmerRow() {
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

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-ROW_INSET * 2, 320]),
      },
    ],
  }));

  return (
    <View style={styles.shimmerRow}>
      <View style={[styles.shimmerAvatar, { backgroundColor: colors.surface }]} />
      <View style={styles.shimmerTextCol}>
        <View style={[styles.shimmerLine, { backgroundColor: colors.surface, width: '42%' }]} />
        <View style={[styles.shimmerLine, { backgroundColor: colors.surface, width: '72%' }]} />
      </View>
      <Animated.View
        style={[
          styles.shimmerSheen,
          { backgroundColor: colors.tint },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

function MatchRow({
  row,
  index,
  isLast,
  onPress,
}: {
  row: Row;
  index: number;
  isLast: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(1);
  const flash = useSharedValue(0);
  const ringScale = useSharedValue(1);

  const displayName = row.stage >= 4 ? row.name : '???';
  const timeLabel = row.timer ?? 'kept';
  const isMutual = row.timer === null;

  useEffect(() => {
    if (reduceMotion) {
      enter.value = 1;
      return;
    }
    enter.value = withDelay(
      index * motion.matchesList.rowStaggerMs,
      withTiming(1, { duration: motion.fast }),
    );
  }, [enter, index, reduceMotion]);

  useEffect(() => {
    if (!isMutual || reduceMotion) return;
    const { scale: peak, durationMs } = motion.matchesList.avatarPulse;
    ringScale.value = withSequence(
      withTiming(peak, { duration: durationMs }),
      withTiming(1, { duration: durationMs }),
    );
  }, [isMutual, reduceMotion, ringScale]);

  const rowAnimStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * motion.matchesList.rowEnterOffset },
      { scale: scale.value },
    ],
    backgroundColor: interpolateColor(flash.value, [0, 1], [colors.bg, colors.surface]),
  }));

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const onPressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(motion.matchesList.rowPressScale, motion.spring);
      flash.value = withTiming(1, { duration: motion.fast / 2 });
    }
  };

  const onPressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, motion.spring);
      flash.value = withTiming(0, { duration: motion.fast });
    }
  };

  const onRowPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={rowAnimStyle}>
      <Pressable
        onPress={onRowPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.rowPressable}
      >
        <Animated.View style={ringAnimStyle}>
          <View style={styles.avatarWrap}>
            <BlurAvatar size={AVATAR_SIZE} stage={row.stage} />
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: colors.success, borderColor: colors.bg },
              ]}
            />
          </View>
        </Animated.View>
        <View style={styles.rowBody}>
          <View style={styles.rowTopLine}>
            <AppText variant="heading" numberOfLines={1} style={styles.rowName}>
              {displayName}
            </AppText>
            <AppText variant="caption" tone="textMuted" style={styles.rowTime}>
              {timeLabel}
            </AppText>
          </View>
          <AppText tone="textMuted" numberOfLines={1}>
            {row.preview}
          </AppText>
        </View>
      </Pressable>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: ROW_INSET }]} />
      )}
    </Animated.View>
  );
}

export default function ChatsListScreen() {
  const router = useRouter();

  const [segment, setSegment] = useState<Segment>('All');

  const renderRow = ({ item, index }: ListRenderItemInfo<Row>) => (
    <MatchRow
      row={item}
      index={index}
      isLast={index === ROWS.length - 1}
      onPress={() => router.push('/chat')}
    />
  );

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <AppText variant="title">Chats</AppText>
      </View>
      <SegmentFilter value={segment} onChange={setSegment} />
      {IS_LOADING ? (
        <View style={styles.shimmerList}>
          <ShimmerRow />
          <ShimmerRow />
          <ShimmerRow />
        </View>
      ) : (
        <FlatList
          data={ROWS}
          keyExtractor={(row) => row.preview}
          renderItem={renderRow}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: space.xxs,
  },
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    padding: 4,
    marginBottom: space.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  segmentHighlight: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: radii.pill,
  },
  segmentPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  segmentLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: space.lg,
  },
  rowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AVATAR_GAP,
    paddingVertical: space.sm,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  rowName: {
    flex: 1,
  },
  rowTime: {
    fontFamily: fonts.regular,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  shimmerList: {
    gap: space.md,
    paddingTop: space.xs,
  },
  shimmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AVATAR_GAP,
    overflow: 'hidden',
    paddingVertical: space.sm,
  },
  shimmerAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  shimmerTextCol: {
    flex: 1,
    gap: space.xs,
  },
  shimmerLine: {
    height: 12,
    borderRadius: radii.sm,
  },
  shimmerSheen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    opacity: 0.45,
  },
});
