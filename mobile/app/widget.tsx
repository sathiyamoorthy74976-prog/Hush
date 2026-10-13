import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

export default function WidgetScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const streak = useGameStore((s) => s.streak);

  return (
    <Screen>
      <AppText variant="title">Home widget</AppText>
      <AppText tone="textSecondary">Preview of the lock-screen / home streak tile.</AppText>
      <View style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.text }]}>
        <AppText variant="caption">HUSH</AppText>
        <AppText variant="display">🔥 {streak}</AppText>
        <AppText variant="caption" tone="textMuted">
          Don’t drop it
        </AppText>
      </View>
      <Button label="Looks good" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 160,
    height: 160,
    borderRadius: radii.lg,
    borderWidth: 3,
    borderBottomWidth: 6,
    padding: space.sm,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: space.md,
  },
});
