import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AuthHeader,
  LoadingPill,
  NumericKeypad,
  RoundForwardButton,
} from '@/components/auth';
import { AppText } from '@/components/ui';
import { isPhoneValid, useAuthFlowStore } from '@/store/authFlow';
import { space, useTheme } from '@/theme';

const LOADING_MS = 1200;

export default function PhoneScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { countryLabel, dialCode, phoneDigits, setPhoneDigits } = useAuthFlowStore();
  const [loading, setLoading] = useState(false);

  const valid = isPhoneValid(phoneDigits);

  const onKey = (key: string) => {
    if (key === 'del') {
      setPhoneDigits(phoneDigits.slice(0, -1));
      return;
    }
    setPhoneDigits(phoneDigits + key);
  };

  const onContinue = () => {
    if (!valid || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/auth/verify');
    }, LOADING_MS);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.top}>
        <AuthHeader
          title="Can we get your number, please?"
          subtitle="We only use phone numbers to make sure everyone on Hush is real."
          onBack={() => router.back()}
        />
        <View style={styles.fields}>
          <View style={styles.fieldBlock}>
            <AppText variant="caption" tone="textMuted">Country</AppText>
            <View style={[styles.field, { borderColor: colors.border }]}>
              <AppText variant="heading">{countryLabel} {dialCode}</AppText>
              <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </View>
          </View>
          <View style={styles.fieldBlock}>
            <AppText variant="caption" tone="textMuted">Phone number</AppText>
            <View style={[styles.field, { borderColor: colors.border }]}>
              <AppText variant="heading" style={styles.phoneValue}>
                {phoneDigits || ' '}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.privacy}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          <AppText variant="caption" tone="textMuted" style={styles.privacyText}>
            We never share this with anyone and it won&apos;t be on your profile.
          </AppText>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.forwardRow}>
          <View style={styles.forwardSpacer} />
          <RoundForwardButton enabled={valid && !loading} onPress={onContinue} />
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
  fields: { gap: space.md, marginTop: space.sm },
  fieldBlock: { gap: space.xxs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: space.xs,
    minHeight: 44,
  },
  phoneValue: { flex: 1, fontSize: 20 },
  privacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: space.lg,
    paddingRight: space.sm,
  },
  privacyText: { flex: 1, lineHeight: 18 },
  bottom: { marginTop: 'auto' },
  forwardRow: {
    flexDirection: 'row',
    paddingHorizontal: space.sm,
    paddingBottom: space.xs,
  },
  forwardSpacer: { flex: 1 },
});
