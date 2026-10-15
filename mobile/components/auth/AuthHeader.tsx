import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
};

export function AuthHeader({ title, subtitle, onBack }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <AppText variant="title" style={styles.title}>{title}</AppText>
      {subtitle ? (
        <View style={styles.subtitle}>
          {typeof subtitle === 'string' ? <AppText tone="textSecondary">{subtitle}</AppText> : subtitle}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs, marginBottom: space.sm },
  back: { marginLeft: -4, marginBottom: space.xs },
  backPlaceholder: { height: 28 },
  title: { fontSize: 28, lineHeight: 34 },
  subtitle: { marginTop: 4 },
});
