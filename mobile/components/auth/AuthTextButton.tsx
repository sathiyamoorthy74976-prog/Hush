import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';

type Props = {
  label: string;
  onPress: () => void;
  underline?: boolean;
};

export function AuthTextButton({ label, onPress, underline }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.hit}>
      <AppText variant="body" tone="text" style={underline ? styles.underline : undefined}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { paddingVertical: 8, alignItems: 'center' },
  underline: { textDecorationLine: 'underline', fontWeight: '700' },
});
