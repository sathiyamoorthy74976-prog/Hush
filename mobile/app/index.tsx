import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthPrimaryButton, AuthTextButton } from '@/components/auth';
import { AppText } from '@/components/ui';
import { APP_NAME } from '@/constants/app';
import { useAuthFlowStore } from '@/store/authFlow';
import { space, useTheme } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setMode = useAuthFlowStore((s) => s.setMode);

  const start = (mode: 'create' | 'login') => {
    setMode(mode);
    router.push('/auth/phone');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SafeAreaView style={styles.topSafe} edges={['top']}>
        <View style={styles.top}>
          <View style={[styles.logoMark, { backgroundColor: colors.brand }]}>
            <AppText style={styles.logoEmoji}>👻</AppText>
          </View>
        </View>
      </SafeAreaView>
      <View style={[styles.brandBand, { backgroundColor: colors.brand }]}>
        <AppText variant="display" style={[styles.wordmark, { color: colors.brandInk }]}>
          {APP_NAME}
        </AppText>
      </View>
      <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
        <View style={styles.actions}>
          <AuthPrimaryButton label="Create an account" onPress={() => start('create')} />
          <AuthTextButton label="I have an account" onPress={() => start('login')} underline />
          <AppText variant="caption" tone="textMuted" style={styles.legal}>
            By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.
          </AppText>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  topSafe: { flex: 1 },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: space.xl,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 26, lineHeight: 32 },
  brandBand: {
    paddingVertical: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontSize: 40, lineHeight: 46, fontWeight: '800' },
  bottomSafe: { flex: 1 },
  actions: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingTop: space.lg,
    gap: space.xs,
    justifyContent: 'flex-start',
  },
  legal: { textAlign: 'center', marginTop: space.md, lineHeight: 18, paddingHorizontal: space.xs },
});

