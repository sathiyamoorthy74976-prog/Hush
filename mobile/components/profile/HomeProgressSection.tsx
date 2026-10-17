import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { APP_NAME } from '@/constants/app';
import { AppText, Card, GameModal } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

const QUESTS = [
  { title: 'Say hi first', xp: 20 },
  { title: 'Finish a Spark', xp: 80 },
  { title: 'Keep a streak', xp: 15 },
];

export function HomeProgressSection() {
  const router = useRouter();
  const { colors } = useTheme();
  const { streak, xp, xpToNext, energy, league } = useGameStore();
  const [chest, setChest] = useState(false);
  const [milestone, setMilestone] = useState(false);

  return (
    <View style={styles.section}>
      <AppText variant="heading">Progress</AppText>

      <View style={styles.top}>
        <Pressable onPress={() => setMilestone(true)} accessibilityLabel={`${streak} day streak`}>
          <AppText variant="title">🔥 {streak}</AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(tabs)/league')}
          style={[styles.league, { backgroundColor: colors.tint, borderColor: colors.border }]}
        >
          <AppText variant="caption">{league} league</AppText>
        </Pressable>
      </View>

      <View style={[styles.xpTrack, { backgroundColor: colors.disabledBg, borderColor: colors.border }]}>
        <View
          style={[
            styles.xpFill,
            { width: `${Math.min(100, (xp / xpToNext) * 100)}%`, backgroundColor: colors.brand },
          ]}
        />
      </View>
      <AppText variant="caption" tone="textMuted">
        {xp} / {xpToNext} XP
      </AppText>

      <View style={styles.energy}>
        {Array.from({ length: 5 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.spark,
              { backgroundColor: i < energy ? colors.brand : colors.disabledBg, borderColor: colors.borderStrong },
            ]}
          />
        ))}
      </View>

      <Pressable onPress={() => router.push('/qotd')}>
        <Card tint>
          <AppText variant="caption">Question of the Day</AppText>
          <AppText variant="heading">What’s the last song you replayed?</AppText>
          <AppText tone="textMuted">Answer to keep your streak flame.</AppText>
        </Card>
      </Pressable>

      {QUESTS.map((q) => (
        <Card key={q.title}>
          <AppText variant="heading">{q.title}</AppText>
          <AppText variant="caption" tone="brand">
            +{q.xp} XP
          </AppText>
        </Card>
      ))}

      <Pressable onPress={() => router.push('/widget')}>
        <AppText variant="caption" tone="brand">
          Add {APP_NAME} streak widget
        </AppText>
      </Pressable>
      <Pressable onPress={() => setChest(true)}>
        <AppText variant="caption" tone="textMuted">
          Open a chest
        </AppText>
      </Pressable>

      <GameModal
        visible={chest}
        title="Chest unlocked"
        body="Sticker pack + 40 XP. Cosmetic only."
        cta="Nice"
        onClose={() => setChest(false)}
      >
        <AppText variant="display" style={{ textAlign: 'center' }}>
          📦
        </AppText>
      </GameModal>
      <GameModal
        visible={milestone}
        title={`${streak} day streak`}
        body="You showed up. Flame grows. Freeze still waiting in Friends."
        cta="Keep going"
        onClose={() => setMilestone(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm, marginTop: space.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  league: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 6 },
  xpTrack: { height: 10, borderRadius: radii.pill, borderWidth: 1, overflow: 'hidden' },
  xpFill: { height: '100%' },
  energy: { flexDirection: 'row', justifyContent: 'center', gap: space.xs },
  spark: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, transform: [{ rotate: '20deg' }] },
});
