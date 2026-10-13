import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { useTheme } from '@/theme';

export default function MatchingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const resetSession = useGameStore((s) => s.resetSession);

  useEffect(() => {
    resetSession();
    const t = setTimeout(() => router.replace('/match-found'), 1800);
    return () => clearTimeout(t);
  }, [resetSession, router]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={[styles.radar, { borderColor: colors.brand }]}>
          <View style={[styles.ping, { backgroundColor: colors.brand }]} />
        </View>
        <AppText variant="title">Finding a hush…</AppText>
        <AppText tone="textSecondary" style={{ textAlign: 'center' }}>
          Someone on campus, same energy window. Photo stays hidden.
        </AppText>
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  radar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ping: { width: 28, height: 28, borderRadius: 14 },
});
