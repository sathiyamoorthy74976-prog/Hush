import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { space } from '@/theme';

export default function MutualScreen() {
  const router = useRouter();
  const addXp = useGameStore((s) => s.addXp);

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="display">🎉</AppText>
        <AppText variant="title">Mutual Match</AppText>
        <AppText tone="textSecondary" style={{ textAlign: 'center' }}>
          Chest popped. This chat stays. No timer.
        </AppText>
        <AppText variant="display">📦✨</AppText>
      </View>
      <Button
        label="Grab the loot"
        variant="gold"
        onPress={() => {
          addXp(80);
          router.replace('/summary');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.sm, paddingVertical: space.lg },
});
