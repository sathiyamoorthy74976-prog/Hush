import { StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

const DAYS = Array.from({ length: 14 }, (_, i) => i < 6);

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { nickname, streak, xp, interests } = useGameStore();

  return (
    <Screen>
      <AppText variant="title">{nickname}</AppText>
      <AppText tone="textMuted">{xp} XP · campus verified</AppText>
      <View style={styles.wrap}>
        <Chip label="First spark" selected />
        <Chip label="Streak 5" selected />
        <Chip label="Kind soul" selected />
      </View>
      <Card>
        <AppText variant="heading">🔥 {streak} day streak</AppText>
        <View style={styles.cal}>
          {DAYS.map((on, i) => (
            <View
              key={i}
              style={[
                styles.day,
                {
                  backgroundColor: on ? colors.brand : colors.disabledBg,
                  borderColor: colors.borderStrong,
                },
              ]}
            />
          ))}
        </View>
      </Card>
      <AppText variant="caption">Interests</AppText>
      <View style={styles.wrap}>
        {interests.map((tag) => (
          <Chip key={tag} label={tag} selected />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  cal: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  day: { width: 28, height: 28, borderRadius: radii.sm, borderWidth: 2 },
});
