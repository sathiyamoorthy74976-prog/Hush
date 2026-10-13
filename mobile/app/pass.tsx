import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';

export default function PassScreen() {
  const router = useRouter();
  const addXp = useGameStore((s) => s.addXp);

  return (
    <Screen>
      <AppText variant="display">🌤️</AppText>
      <AppText variant="title">You finished!</AppText>
      <AppText tone="textSecondary">Soft landing. +20 XP for showing up and talking anyway.</AppText>
      <Button
        label="Collect +20 XP"
        variant="green"
        onPress={() => {
          addXp(20);
          router.replace('/summary');
        }}
      />
    </Screen>
  );
}
