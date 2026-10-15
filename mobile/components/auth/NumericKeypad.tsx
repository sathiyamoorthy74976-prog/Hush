import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
] as const;

type Props = {
  onKey: (key: string) => void;
};

export function NumericKeypad({ onKey }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.tray, { backgroundColor: colors.disabledBg }]}>
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="spacer" style={styles.key} />;
            }
            const label = key === 'del' ? '⌫' : key;
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={key === 'del' ? 'Delete' : key}
                onPress={() => onKey(key)}
                style={[styles.key, { backgroundColor: colors.surface }]}
              >
                <AppText variant="heading" style={styles.keyText}>{label}</AppText>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    paddingTop: space.xs,
    paddingBottom: space.sm,
    paddingHorizontal: space.xxs,
    gap: 6,
  },
  row: { flexDirection: 'row', gap: 6 },
  key: {
    flex: 1,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 22, lineHeight: 26 },
});
