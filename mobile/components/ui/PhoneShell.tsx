import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export const PHONE = { width: 390, height: 844 };

export function PhoneShell({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  if (Platform.OS !== 'web') {
    return <View style={[styles.fill, { backgroundColor: colors.bg }]}>{children}</View>;
  }

  return (
    <View style={[styles.webPage, { backgroundColor: colors.disabledBg }]}>
      <View
        style={[
          styles.phone,
          { backgroundColor: colors.bg, borderColor: colors.text },
        ]}
      >
        <View style={styles.fill}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  webPage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  phone: {
    width: PHONE.width,
    height: PHONE.height,
    borderRadius: 40,
    borderWidth: 3,
    overflow: 'hidden',
  },
});
