import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CaughtUp,
  CommentSheet,
  DiscoverHeader,
  DiscoverToast,
  FeedSkeleton,
  FilterSheet,
  GoLiveButton,
  NextProfileButton,
  ProfileCard,
  PromptCard,
} from '@/components/discover';
import { useDiscoverFeed } from '@/hooks/useDiscoverFeed';
import { motion, space, useReducedMotion, useTheme } from '@/theme';
import type { DiscoverFeedItem, DiscoverProfile } from '@/types/discover';
import { isCaughtUpItem } from '@/types/discover';

const HEADER_HEIGHT = 52;
const FOOTER_HEIGHT = 76;
const TOAST_MESSAGE = "Sent. They'll see it when you match.";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<FlatList<DiscoverFeedItem>>(null);

  const feed = useDiscoverFeed();
  const [replyDraft, setReplyDraft] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [commentProfileId, setCommentProfileId] = useState<string | null>(null);

  const tabBarHeight = 56 + Math.max(insets.bottom, 8);
  const feedHeight =
    Dimensions.get('window').height - insets.top - HEADER_HEIGHT - FOOTER_HEIGHT - tabBarHeight;

  const pageProgress = useSharedValue(1);

  const scrollToIndex = useCallback(
    (index: number) => {
      listRef.current?.scrollToIndex({ index, animated: !reduceMotion });
      feed.setCurrentIndex(index);
    },
    [feed, reduceMotion],
  );

  const goNext = useCallback(() => {
    if (feed.currentIndex >= feed.feedItems.length - 1) return;
    if (!reduceMotion) {
      pageProgress.value = withTiming(0.95, { duration: motion.discover.pageSpringMs / 2 }, () => {
        pageProgress.value = withSpring(1, motion.spring);
      });
    }
    scrollToIndex(feed.currentIndex + 1);
    setReplyDraft('');
  }, [feed.currentIndex, feed.feedItems.length, pageProgress, reduceMotion, scrollToIndex]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / feedHeight);
    if (index !== feed.currentIndex) {
      feed.setCurrentIndex(index);
      setReplyDraft('');
    }
  };

  const activeProfile = feed.activeProfile;
  const commentProfile = useMemo(() => {
    if (!commentProfileId) return activeProfile;
    return feed.profiles.find((p) => p.id === commentProfileId) ?? activeProfile;
  }, [activeProfile, commentProfileId, feed.profiles]);

  const showToast = () => setToast(TOAST_MESSAGE);

  const handleSendReply = () => {
    if (!activeProfile || !replyDraft.trim()) return;
    feed.addComment(activeProfile.id, replyDraft);
    setReplyDraft('');
    showToast();
  };

  const handleSendComment = (text: string) => {
    const id = commentProfile?.id ?? activeProfile?.id;
    if (!id) return;
    feed.addComment(id, text);
    showToast();
  };

  const feedAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pageProgress.value }],
    opacity: 0.92 + (pageProgress.value - 0.95) * (1 / 0.05) * 0.08,
  }));

  const renderItem = ({ item, index }: ListRenderItemInfo<DiscoverFeedItem>) => {
    if (isCaughtUpItem(item)) {
      return <CaughtUp height={feedHeight} />;
    }
    const profile = item as DiscoverProfile;
    const isActive = index === feed.currentIndex;
    const cardBodyHeight = Math.round(feedHeight * 0.58);

    return (
      <View style={[styles.page, { height: feedHeight }]}>
        <ProfileCard profile={profile} height={cardBodyHeight} isActive={isActive} />
        <PromptCard
          profile={profile}
          isActive={isActive}
          reply={isActive ? replyDraft : ''}
          onReplyChange={setReplyDraft}
          onLike={() => {
            if (!isActive) return;
            const wasLiked = profile.prompt.liked;
            feed.toggleLike(profile.id);
            if (!wasLiked) showToast();
          }}
          onCommentPress={() => {
            setCommentProfileId(profile.id);
            setCommentOpen(true);
          }}
          onSendReply={() => {
            if (!isActive) return;
            handleSendReply();
          }}
        />
      </View>
    );
  };

  const onRefresh = feed.currentIndex === 0 ? feed.refresh : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <DiscoverHeader
        hasNewLikes={feed.hasNewLikes}
        onFilterPress={() => setFilterOpen(true)}
        onNotificationsPress={() => {
          feed.clearNewLikes();
          router.push('/(tabs)/league');
        }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={HEADER_HEIGHT + insets.top}
      >
        {feed.loading ? (
          <FeedSkeleton height={feedHeight} />
        ) : (
          <Animated.View style={[styles.flex, feedAnimStyle]}>
            <FlatList
              ref={listRef}
              data={feed.feedItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              pagingEnabled
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              snapToInterval={feedHeight}
              snapToAlignment="start"
              disableIntervalMomentum
              bounces={feed.currentIndex === 0}
              onMomentumScrollEnd={onMomentumScrollEnd}
              getItemLayout={(_, index) => ({
                length: feedHeight,
                offset: feedHeight * index,
                index,
              })}
              refreshControl={
                onRefresh
                  ? (
                    <RefreshControl
                      refreshing={feed.refreshing}
                      onRefresh={onRefresh}
                      tintColor={colors.brand}
                    />
                  )
                  : undefined
              }
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  listRef.current?.scrollToIndex({ index: info.index, animated: false });
                }, 50);
              }}
            />
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <GoLiveButton onPress={() => router.push('/matching')} />
        <NextProfileButton
          onPress={goNext}
          disabled={feed.currentIndex >= feed.feedItems.length - 1}
        />
      </View>

      <CommentSheet
        visible={commentOpen}
        onClose={() => setCommentOpen(false)}
        comments={commentProfile?.prompt.comments ?? []}
        onSend={handleSendComment}
      />

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={feed.filters}
        onChange={feed.setFilters}
      />

      <DiscoverToast message={toast} onHidden={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  page: {
    paddingHorizontal: space.sm,
    gap: space.xs,
    justifyContent: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    minHeight: FOOTER_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
