import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import type { DiscoverProfile } from '@/types/discover';
import { fonts, minTapTarget, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  profile: DiscoverProfile;
  isActive: boolean;
  reply: string;
  onReplyChange: (text: string) => void;
  onLike: () => void;
  onCommentPress: () => void;
  onSendReply: () => void;
  onReplyFocus?: () => void;
};

function promptLabel(pronoun: DiscoverProfile['pronoun']) {
  if (pronoun === 'her') return 'Her prompt';
  if (pronoun === 'his') return 'His prompt';
  return 'Their prompt';
}

function replyPlaceholder(pronoun: DiscoverProfile['pronoun']) {
  if (pronoun === 'her') return 'Reply to her answer...';
  if (pronoun === 'his') return 'Reply to his answer...';
  return 'Reply to their answer...';
}

export function PromptCard({
  profile,
  isActive,
  reply,
  onReplyChange,
  onLike,
  onCommentPress,
  onSendReply,
  onReplyFocus,
}: Props) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const liked = profile.prompt.liked;
  const commentCount = profile.prompt.comments.length;
  const canSend = reply.trim().length > 0;

  const enter = useSharedValue(reduceMotion || !isActive ? 1 : 0);
  const likeScale = useSharedValue(1);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (reduceMotion) {
      enter.value = 1;
      return;
    }
    enter.value = 0;
    enter.value = withDelay(
      motion.discover.promptDelayMs,
      withTiming(1, { duration: motion.fast }),
    );
  }, [enter, isActive, profile.id, reduceMotion]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 12 }],
  }));

  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLike = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!liked && !reduceMotion) {
      likeScale.value = withSpring(1.12, motion.spring, () => {
        likeScale.value = withSpring(1, motion.spring);
      });
      setBurst(true);
      setTimeout(() => setBurst(false), 500);
    }
    onLike();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.labelRow}>
        <Ionicons name="sparkles-outline" size={14} color={colors.textSecondary} />
        <AppText variant="caption" tone="textSecondary">{promptLabel(profile.pronoun)}</AppText>
      </View>
      <AppText variant="heading" style={styles.question}>{profile.prompt.question}</AppText>
      <AppText variant="body">{profile.prompt.answer}</AppText>

      <View style={styles.actions}>
        <Animated.View style={likeAnimStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Unlike prompt' : 'Like prompt'}
            onPress={handleLike}
            style={[
              styles.likeBtn,
              {
                backgroundColor: liked ? colors.accent : colors.accent,
                opacity: liked ? 1 : 1,
              },
            ]}
          >
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={colors.onDanger} />
            <AppText variant="caption" style={{ color: colors.onDanger, fontFamily: fonts.bold }}>
              {liked ? 'Liked' : 'Like'}
            </AppText>
          </Pressable>
        </Animated.View>
        {burst ? <HeartBurst /> : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Comments, ${commentCount}`}
          onPress={onCommentPress}
          style={[styles.commentBtn, { backgroundColor: colors.bg, borderColor: colors.border }]}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
          <AppText variant="caption">{commentCount}</AppText>
        </Pressable>

        <View style={[styles.replyWrap, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <TextInput
            value={reply}
            onChangeText={onReplyChange}
            onFocus={onReplyFocus}
            placeholder={replyPlaceholder(profile.pronoun)}
            placeholderTextColor={colors.textMuted}
            style={[styles.replyInput, { color: colors.text, fontFamily: fonts.regular }]}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (canSend) onSendReply();
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send reply"
            disabled={!canSend}
            onPress={onSendReply}
            style={[
              styles.sendBtn,
              {
                backgroundColor: canSend ? colors.brand : colors.disabledBg,
                opacity: canSend ? 1 : 0.6,
              },
            ]}
          >
            <Ionicons
              name="send"
              size={16}
              color={canSend ? colors.onBrand : colors.disabledText}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function HeartBurst() {
  const { colors } = useTheme();
  const hearts = Array.from({ length: motion.discover.likeHeartCount }, (_, i) => i);

  return (
    <View style={styles.burstLayer} pointerEvents="none">
      {hearts.map((i) => (
        <BurstHeart key={i} index={i} color={colors.accent} />
      ))}
    </View>
  );
}

function BurstHeart({ index, color }: { index: number; color: string }) {
  const angle = (index / motion.discover.likeHeartCount) * Math.PI * 2;
  const dist = 28 + (index % 3) * 6;
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    tx.value = withTiming(Math.cos(angle) * dist, { duration: motion.discover.commentEnterMs });
    ty.value = withTiming(Math.sin(angle) * dist - 20, { duration: motion.discover.commentEnterMs });
    opacity.value = withDelay(80, withTiming(0, { duration: 200 }));
  }, [angle, dist, opacity, tx, ty]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: 0.6 }],
  }));

  return (
    <Animated.View style={[styles.burstHeart, style]}>
      <Ionicons name="heart" size={12} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.sm,
    gap: space.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  question: {
    fontFamily: fonts.bold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    minHeight: minTapTarget,
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    minHeight: minTapTarget,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  replyWrap: {
    flex: 1,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 14,
    paddingRight: 4,
    minHeight: minTapTarget,
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstHeart: {
    position: 'absolute',
  },
});
