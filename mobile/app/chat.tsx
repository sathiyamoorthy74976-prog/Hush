import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BlurAvatar, Button, Card, Chip, SparkMeter } from '@/components/ui';
import { SPARK_STAGES, useGameStore } from '@/store/game';
import { fonts, motion, radii, space, useReducedMotion, useTheme } from '@/theme';

const TAGS = ['Late nights', 'Playlists', 'Studio'];
const LINE_HEIGHT = 22;
const MAX_LINES = 5;
const INPUT_MAX_HEIGHT = LINE_HEIGHT * MAX_LINES + 20;

type Line = { me: boolean; t: string };

const TIMESTAMP_SAMPLES = ['9:24 PM', '9:27 PM', '9:31 PM', '9:35 PM', '9:40 PM'];

function formatTimestamp(index: number) {
  return TIMESTAMP_SAMPLES[index % TIMESTAMP_SAMPLES.length];
}

function ChatHeader({
  stage,
  onBack,
  onMore,
}: {
  stage: number;
  onBack: () => void;
  onMore: () => void;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(1);
  const displayName = stage >= 4 ? 'Rae' : '???';

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(motion.chat.onlinePulse.scale, {
          duration: motion.chat.onlinePulse.durationMs,
        }),
        withTiming(1, { duration: motion.chat.onlinePulse.durationMs }),
      ),
      -1,
      false,
    );
  }, [pulse, reduceMotion]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={12}
        style={styles.headerIconHit}
      >
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </Pressable>
      <View style={styles.headerIdentity}>
        <View style={styles.headerAvatarWrap}>
          <BlurAvatar size={44} stage={stage} />
          <Animated.View
            style={[
              styles.onlineDot,
              dotStyle,
              { backgroundColor: colors.success, borderColor: colors.bg },
            ]}
          />
        </View>
        <View style={styles.headerTextCol}>
          <View style={styles.nameRow}>
            <AppText variant="heading" numberOfLines={1}>{displayName}</AppText>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          </View>
          <AppText variant="caption" tone="textMuted">Online now</AppText>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More options"
        hitSlop={12}
        onPress={onMore}
        style={styles.headerIconHit}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
      </Pressable>
    </View>
  );
}

function MessageBubble({ message, index }: { message: Line; index: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const enter = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: motion.chat.messageEnterMs });
  }, [enter]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      {
        translateX:
          (1 - enter.value) * (message.me ? motion.chat.messageEnterOffset : -motion.chat.messageEnterOffset),
      },
    ],
  }));

  const bubbleRadii = message.me
    ? {
        borderTopLeftRadius: radii.lg,
        borderTopRightRadius: radii.lg,
        borderBottomLeftRadius: radii.lg,
        borderBottomRightRadius: radii.sm,
      }
    : {
        borderTopLeftRadius: radii.sm,
        borderTopRightRadius: radii.lg,
        borderBottomLeftRadius: radii.lg,
        borderBottomRightRadius: radii.lg,
      };

  return (
    <Animated.View
      style={[
        styles.messageCol,
        { alignSelf: message.me ? 'flex-end' : 'flex-start' },
        animStyle,
      ]}
    >
      <View
        style={[
          styles.bubble,
          bubbleRadii,
          {
            backgroundColor: message.me ? colors.brand : colors.surface,
          },
        ]}
      >
        <AppText tone="text">{message.t}</AppText>
      </View>
      <View style={[styles.metaRow, message.me ? styles.metaRowMe : styles.metaRowThem]}>
        <AppText variant="caption" tone="textMuted" style={styles.timestamp}>
          {formatTimestamp(index)}
        </AppText>
        {message.me ? (
          <Ionicons name="checkmark-done" size={14} color={colors.textMuted} style={styles.readReceipt} />
        ) : null}
      </View>
    </Animated.View>
  );
}

function ChatComposer({
  text,
  onChangeText,
  onSend,
  inputRef,
}: {
  text: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  inputRef: RefObject<TextInput | null>;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const canSend = text.trim().length > 0;
  const sendScale = useSharedValue(1);
  const sendProgress = useSharedValue(canSend ? 1 : 0);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    sendProgress.value = withTiming(canSend ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.chat.sendStateMs,
    });
  }, [canSend, reduceMotion, sendProgress]);

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
    backgroundColor: interpolateColor(sendProgress.value, [0, 1], [colors.disabledBg, colors.brand]),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const onSendPressIn = () => {
    if (!canSend) return;
    if (!reduceMotion) {
      sendScale.value = withSpring(motion.chat.sendPressScale, motion.spring);
    }
  };

  const onSendPressOut = () => {
    if (!reduceMotion) {
      sendScale.value = withSpring(1, motion.spring);
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reduceMotion) {
      iconRotate.value = withSequence(
        withTiming(motion.chat.sendIconTiltDeg, { duration: motion.chat.sendStateMs }),
        withTiming(0, { duration: motion.chat.sendStateMs }),
      );
    }
    onSend();
  };

  return (
    <View style={[styles.composeBar, { backgroundColor: colors.bg }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Emoji keyboard"
        onPress={() => inputRef.current?.focus()}
        style={styles.composeIconHit}
      >
        <Ionicons name="happy-outline" size={26} color={colors.textMuted} />
      </Pressable>
      <View style={[styles.inputShell, { backgroundColor: colors.surface }]}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onChangeText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          multiline
          blurOnSubmit={false}
          returnKeyType="default"
          scrollEnabled
          style={[
            styles.textInput,
            {
              color: colors.text,
              maxHeight: INPUT_MAX_HEIGHT,
            },
          ]}
          cursorColor={colors.brand}
          selectionColor={colors.brand}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        disabled={!canSend}
        onPress={handleSend}
        onPressIn={onSendPressIn}
        onPressOut={onSendPressOut}
      >
        <Animated.View style={[styles.sendButton, sendButtonStyle]}>
          <Animated.View style={iconStyle}>
            <Ionicons
              name="send"
              size={18}
              color={canSend ? colors.text : colors.textMuted}
              style={styles.sendIcon}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { stage, bumpSpark, setSparkStage } = useGameStore();
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [safetyNote, setSafetyNote] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { me: false, t: 'okay but midnight city is a personality' },
    { me: true, t: 'window seat truth. rain optional.' },
  ]);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const send = () => {
    if (!text.trim()) return;
    setLines((l) => [...l, { me: true, t: text.trim() }]);
    setText('');
    bumpSpark();
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [lines.length]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ChatHeader
          stage={stage}
          onBack={() => router.back()}
          onMore={() => setSafetyOpen(true)}
        />

        <Modal visible={safetyOpen} transparent animationType="fade" onRequestClose={() => setSafetyOpen(false)}>
          <Pressable style={[styles.safetyScrim, { backgroundColor: colors.scrim }]} onPress={() => setSafetyOpen(false)} />
          <View style={[styles.safetySheet, { backgroundColor: colors.bg }]}>
            <AppText variant="heading">Safety</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Report user"
              style={[styles.safetyRow, { borderColor: colors.border }]}
              onPress={() => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                setSafetyNote('Report submitted. Our team will review.');
                setSafetyOpen(false);
              }}
            >
              <Ionicons name="flag-outline" size={22} color={colors.text} />
              <AppText variant="body">Report</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Block user"
              style={[styles.safetyRow, { borderColor: colors.border }]}
              onPress={() => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setSafetyNote('Blocked. You won’t see each other again.');
                setSafetyOpen(false);
              }}
            >
              <Ionicons name="hand-left-outline" size={22} color={colors.danger} />
              <AppText variant="body" tone="danger">Block</AppText>
            </Pressable>
            <Button label="Close" variant="ghost" onPress={() => setSafetyOpen(false)} />
          </View>
        </Modal>
        {safetyNote ? (
          <View style={[styles.safetyToast, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppText variant="caption">{safetyNote}</AppText>
          </View>
        ) : null}

        <View style={[styles.sparkWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SparkMeter
            stage={stage}
            onPress={() => setSparkStage(stage >= SPARK_STAGES ? SPARK_STAGES : stage + 1)}
          />
        </View>

        {stage >= 1 ? (
          <View style={styles.tags}>
            {TAGS.map((tag) => (
              <Chip key={tag} label={tag} selected />
            ))}
          </View>
        ) : null}
        {stage >= 2 ? (
          <Card style={styles.qotdCard}>
            <AppText variant="caption">Their QOTD</AppText>
            <AppText variant="heading">Last replay: Midnight City — on the walk home.</AppText>
          </Card>
        ) : null}

        <ScrollView
          ref={scrollRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Pressable style={styles.threadPressable} onPress={Keyboard.dismiss}>
            {lines.map((m, i) => (
              <MessageBubble key={`${i}-${m.t}`} message={m} index={i} />
            ))}
          </Pressable>
        </ScrollView>

        {stage >= SPARK_STAGES ? (
          <View style={styles.decisionWrap}>
            <Button label="Time to decide" onPress={() => router.push('/decision')} />
          </View>
        ) : (
          <ChatComposer
            text={text}
            onChangeText={setText}
            onSend={send}
            inputRef={inputRef}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.xs,
    paddingBottom: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: space.xs,
  },
  headerIconHit: {
    width: 36,
    alignItems: 'flex-start',
  },
  headerIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  headerAvatarWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sparkWrap: {
    marginHorizontal: space.sm,
    marginTop: space.xs,
    padding: space.xs,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingTop: space.xs,
  },
  qotdCard: {
    marginHorizontal: space.sm,
    marginTop: space.xs,
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    gap: space.sm,
    flexGrow: 1,
  },
  threadPressable: {
    gap: space.sm,
  },
  messageCol: {
    maxWidth: '82%',
    gap: 4,
  },
  bubble: {
    paddingHorizontal: space.sm,
    paddingVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaRowMe: {
    alignSelf: 'flex-end',
  },
  metaRowThem: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  readReceipt: {
    marginTop: 1,
  },
  composeBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingTop: space.xs,
    paddingBottom: space.xs,
  },
  composeIconHit: {
    paddingBottom: 10,
  },
  inputShell: {
    flex: 1,
    borderRadius: radii.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendIcon: {
    marginLeft: 2,
  },
  decisionWrap: {
    paddingHorizontal: space.sm,
    paddingBottom: space.xs,
  },
  safetyScrim: {
    ...StyleSheet.absoluteFill,
  },
  safetySheet: {
    position: 'absolute',
    left: space.sm,
    right: space.sm,
    bottom: space.lg,
    borderRadius: radii.lg,
    padding: space.sm,
    gap: space.sm,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  safetyToast: {
    marginHorizontal: space.sm,
    marginTop: space.xs,
    padding: space.xs,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
