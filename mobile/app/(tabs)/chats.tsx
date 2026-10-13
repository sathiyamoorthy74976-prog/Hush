import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, BlurAvatar, Screen } from '@/components/ui';
import { radii, space, useTheme } from '@/theme';

const ROWS = [
  { name: 'Rae', preview: 'mutual — this one stays', stage: 5, timer: null as string | null },
  { name: '???', preview: 'spark 3 — photo still foggy', stage: 3, timer: '02:14:08' },
  { name: '???', preview: 'icebreaker hanging', stage: 1, timer: '11:02:40' },
];

export default function ChatsListScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen>
      <AppText variant="title">Chats</AppText>
      <AppText tone="textMuted">Unmatched sessions expire. Mutual ones never do.</AppText>
      {ROWS.map((row) => (
        <Pressable
          key={row.preview}
          onPress={() => router.push('/chat')}
          style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <BlurAvatar size={52} stage={row.stage} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{row.stage >= 4 ? row.name : '???'}</AppText>
            <AppText tone="textSecondary" numberOfLines={1}>
              {row.preview}
            </AppText>
          </View>
          {row.timer ? (
            <AppText variant="caption" tone="brand">
              {row.timer}
            </AppText>
          ) : (
            <AppText variant="caption" tone="success">
              kept
            </AppText>
          )}
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radii.lg,
  },
});
