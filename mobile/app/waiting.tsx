import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/theme';

export default function WaitingScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/mutual'), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={[styles.pulse, { borderColor: colors.green }]} />
        <AppText variant="title">Waiting on them…</AppText>
        <AppText tone="textSecondary" style={{ textAlign: 'center' }}>
          You already picked Match. Pulse until they do.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  pulse: { width: 88, height: 88, borderRadius: 44, borderWidth: 6 },
});
