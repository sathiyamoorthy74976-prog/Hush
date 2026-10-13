import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AppText, Button, Input, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';

export default function QotdScreen() {
  const router = useRouter();
  const bumpStreak = useGameStore((s) => s.bumpStreak);
  const addXp = useGameStore((s) => s.addXp);
  const [answer, setAnswer] = useState('');

  return (
    <Screen>
      <AppText variant="caption">Question of the Day</AppText>
      <AppText variant="title">What’s the last song you replayed?</AppText>
      <AppText tone="textSecondary">A short answer keeps the flame. No essay.</AppText>
      <Input label="Your answer" value={answer} onChangeText={setAnswer} placeholder="Midnight city, obviously" />
      <Button
        label="Save streak"
        disabled={answer.trim().length < 2}
        onPress={() => {
          bumpStreak();
          addXp(15);
          router.back();
        }}
      />
      <Button label="Skip" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
