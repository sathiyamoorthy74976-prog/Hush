import { useEffect, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { motion, radii, space, useReducedMotion, useTheme } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  snapFractions?: [number, number];
};

export function DraggableSheet({
  visible,
  onClose,
  title,
  children,
  snapFractions = [0.5, 0.9],
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const snapHeights = snapFractions.map((f) => windowH * f);
  const closedY = windowH;
  const translateY = useSharedValue(closedY);
  const snapIndex = useSharedValue(0);

  const openSheet = () => {
    const target = snapHeights[0];
    translateY.value = reduceMotion
      ? withTiming(target, { duration: 0 })
      : withSpring(target, motion.spring);
    snapIndex.value = 0;
  };

  const closeSheet = () => {
    translateY.value = reduceMotion
      ? withTiming(closedY, { duration: 0 })
      : withTiming(closedY, { duration: motion.fast });
  };

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible, windowH]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const base = snapHeights[snapIndex.value] ?? snapHeights[0];
      const next = Math.max(snapHeights[1], Math.min(closedY, base + e.translationY));
      translateY.value = next;
    })
    .onEnd((e) => {
      const base = snapHeights[snapIndex.value] ?? snapHeights[0];
      const projected = base + e.translationY;
      if (projected > windowH * 0.72 || e.velocityY > 900) {
        translateY.value = withTiming(closedY, { duration: motion.fast });
        runOnJS(onClose)();
        return;
      }
      const distances = snapHeights.map((h) => Math.abs(projected - h));
      let nearest = 0;
      if (distances[1] < distances[0]) nearest = 1;
      snapIndex.value = nearest;
      translateY.value = withSpring(snapHeights[nearest], motion.spring);
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.scrim, { backgroundColor: colors.scrim }]} onPress={onClose} />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            {
              backgroundColor: colors.bg,
              paddingBottom: insets.bottom + space.sm,
              height: windowH,
            },
          ]}
        >
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          </View>
          <View style={styles.titleRow}>
            <Pressable
              accessibilityRole="header"
              accessibilityLabel={title}
              onPress={() => {}}
            >
              <Animated.Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>
                {title}
              </Animated.Text>
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: space.xs,
    paddingBottom: space.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.pill,
  },
  titleRow: {
    paddingHorizontal: space.sm,
    paddingBottom: space.xs,
  },
});
