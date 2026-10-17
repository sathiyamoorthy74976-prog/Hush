import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AuthHeader,
  LoadingPill,
  NumericKeypad,
  OTP_LENGTH,
  OtpInput,
  RoundForwardButton,
} from '@/components/auth';
import { AppText } from '@/components/ui';
import { formatPhoneDisplay, useAuthFlowStore } from '@/store/authFlow';
import { space, useTheme } from '@/theme';

const LOADING_MS = 1200;

export default function VerifyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { mode, dialCode, phoneDigits } = useAuthFlowStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const displayPhone = formatPhoneDisplay(dialCode, phoneDigits);
  const complete = otp.length >= OTP_LENGTH;

  const onKey = (key: string) => {
    if (key === 'del') {
      setOtp((v) => v.slice(0, -1));
      return;
    }
    if (otp.length < OTP_LENGTH) setOtp((v) => v + key);
  };

  const onContinue = () => {
    if (!complete || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'login') {
        router.replace('/(tabs)');
      } else {
        router.push('/auth/location');
      }
    }, LOADING_MS);
  };

  const subtitle = (
    <AppText tone="textSecondary">
      Enter the code we&apos;ve sent by text to {displayPhone}.{' '}
      <Pressable accessibilityRole="button" onPress={() => router.replace('/auth/phone')}>
        <AppText tone="text" style={styles.changeLink}>Change number</AppText>
      </Pressable>
    </AppText>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.top}>
        <AuthHeader title="Verify your number" subtitle={subtitle} onBack={() => router.back()} />
        <OtpInput value={otp} />
        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Code sent', 'We sent you a new verification code.')}
        >
          <AppText tone="textSecondary" style={styles.resend}>Didn&apos;t get a code?</AppText>
        </Pressable>
      </View>
      <View style={styles.bottom}>
        <View style={styles.forwardRow}>
          <View style={styles.forwardSpacer} />
          <RoundForwardButton enabled={complete && !loading} onPress={onContinue} />
        </View>
        <NumericKeypad onKey={onKey} />
      </View>
      {loading ? <LoadingPill /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: { flex: 1, paddingHorizontal: space.sm, paddingTop: space.xs },
  changeLink: { textDecorationLine: 'underline', fontWeight: '700' },
  resend: { textDecorationLine: 'underline', marginTop: space.xs },
  bottom: { marginTop: 'auto' },
  forwardRow: {
    flexDirection: 'row',
    paddingHorizontal: space.sm,
    paddingBottom: space.xs,
  },
  forwardSpacer: { flex: 1 },
});

