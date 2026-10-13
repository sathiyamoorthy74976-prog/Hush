import { useRouter } from 'expo-router';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';

export default function SummaryScreen() {
  const router = useRouter();
  const { xp, streak } = useGameStore();

  return (
    <Screen>
      <AppText variant="title">Session wrap</AppText>
      <Card tint>
        <AppText variant="heading">XP now {xp}</AppText>
        <AppText>Streak flame {streak}</AppText>
        <AppText tone="textMuted">Quest: Finish a Spark — done</AppText>
      </Card>
      <Button label="Back to home" onPress={() => router.replace('/(tabs)')} />
      <Button label="See chats" variant="ghost" onPress={() => router.replace('/(tabs)/chats')} />
    </Screen>
  );
}
