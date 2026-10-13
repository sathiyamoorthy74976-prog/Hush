import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { space } from '@/theme';

const BOARD = [
  { place: 1, name: 'Ivy', xp: 920 },
  { place: 2, name: 'You', xp: 240, you: true },
  { place: 3, name: 'Kenji', xp: 210 },
  { place: 4, name: 'Sola', xp: 180 },
];

export default function LeagueScreen() {
  const router = useRouter();
  const league = useGameStore((s) => s.league);

  return (
    <Screen>
      <AppText variant="title">{league} league</AppText>
      <AppText tone="textMuted">This week’s XP. Demotion is real. Boosts are not for sale.</AppText>
      {BOARD.map((row) => (
        <Card key={row.name} tint={row.you}>
          <View style={styles.row}>
            <AppText variant="heading">
              {row.place}. {row.name}
            </AppText>
            <AppText variant="caption">{row.xp} XP</AppText>
          </View>
        </Card>
      ))}
      <Button label="Friends & squads" variant="ghost" onPress={() => router.push('/friends')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.xs },
});
