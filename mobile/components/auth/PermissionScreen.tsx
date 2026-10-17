import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

import { AuthPrimaryButton } from './AuthPrimaryButton';
import { AuthTextButton } from './AuthTextButton';

type Props = {
  icon: ReactNode;
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  footer?: string;
};

export function PermissionScreen({
  icon,
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  footer,
}: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.icon}>{icon}</View>
        <AppText variant="title" style={styles.title}>{title}</AppText>
        <AppText tone="textSecondary" style={styles.body}>{body}</AppText>
      </View>
      <View style={styles.actions}>
        <AuthPrimaryButton label={primaryLabel} onPress={onPrimary} />
        {secondaryLabel && onSecondary ? (
          <AuthTextButton label={secondaryLabel} onPress={onSecondary} />
        ) : null}
        {footer ? (
          <AppText variant="caption" tone="textMuted" style={styles.footer}>{footer}</AppText>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingTop: space.xl,
    alignItems: 'center',
    gap: space.sm,
  },
  icon: { marginBottom: space.md },
  title: { fontSize: 26, lineHeight: 32, textAlign: 'center' },
  body: { textAlign: 'center', lineHeight: 22 },
  actions: {
    paddingHorizontal: space.md,
    paddingBottom: space.lg,
    gap: space.xs,
  },
  footer: { textAlign: 'center', marginTop: space.sm, lineHeight: 18 },
});

