import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import type { DiscoverComment } from '@/types/discover';
import { fonts, minTapTarget, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

import { DraggableSheet } from './DraggableSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: DiscoverComment[];
  onSend: (text: string) => void;
};

function CommentRow({ item, index }: { item: DiscoverComment; index: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: motion.discover.commentEnterMs });
  }, [enter]);

  const style = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateX: (1 - enter.value) * 16 }],
  }));

  return (
    <Animated.View style={[styles.commentRow, style]}>
      <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
        <AppText variant="caption" style={{ fontFamily: fonts.bold }}>
          {item.authorName.charAt(0)}
        </AppText>
      </View>
      <View style={styles.commentBody}>
        <View style={styles.commentMeta}>
          <AppText variant="caption" style={{ fontFamily: fonts.bold }}>{item.authorName}</AppText>
          <AppText variant="caption" tone="textMuted">{item.createdAt}</AppText>
        </View>
        <AppText variant="body">{item.text}</AppText>
      </View>
    </Animated.View>
  );
}

export function CommentSheet({ visible, onClose, comments, onSend }: Props) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);
  const prevLen = useRef(comments.length);

  useEffect(() => {
    if (comments.length > prevLen.current) {
      listRef.current?.scrollToEnd({ animated: true });
    }
    prevLen.current = comments.length;
  }, [comments.length]);

  const canSend = draft.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <DraggableSheet visible={visible} onClose={onClose} title="Comments">
      <FlatList
        ref={listRef}
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <CommentRow item={item} index={index} />}
        ListEmptyComponent={
          <AppText tone="textMuted" style={styles.empty}>No comments yet. Say something kind.</AppText>
        }
      />
      <View style={[styles.composer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text, fontFamily: fonts.regular, borderColor: colors.border }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send comment"
          disabled={!canSend}
          onPress={handleSend}
          style={[
            styles.send,
            { backgroundColor: canSend ? colors.brand : colors.disabledBg },
          ]}
        >
          <AppText variant="caption" style={{ fontFamily: fonts.bold, color: colors.onBrand }}>
            Send
          </AppText>
        </Pressable>
      </View>
    </DraggableSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
    gap: space.sm,
  },
  commentRow: {
    flexDirection: 'row',
    gap: space.xs,
    marginBottom: space.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: space.lg,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingTop: space.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: minTapTarget,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.pill,
    paddingHorizontal: space.sm,
    fontSize: 15,
  },
  send: {
    minHeight: minTapTarget,
    paddingHorizontal: space.sm,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
