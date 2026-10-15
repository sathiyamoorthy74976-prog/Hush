import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, space, useTheme } from '@/theme';

const LEN = 6;

type Props = {
  value: string;
};

export function OtpInput({ value }: Props) {
  const { colors } = useTheme();
  const digits = value.padEnd(LEN, ' ').slice(0, LEN).split('');

  return (
    <View style={styles.row}>
      {digits.map((d, i) => (
        <View
          key={i}
          style={[
            styles.box,
            {
              borderColor: colors.borderStrong,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <AppText variant="heading" style={styles.digit}>
            {d.trim() ? d : ''}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export const OTP_LENGTH = LEN;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.xxs,
    marginVertical: space.md,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { fontSize: 22, lineHeight: 26 },
});
