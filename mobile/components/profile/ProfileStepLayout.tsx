import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthPrimaryButton, AuthTextButton } from '@/components/auth';
import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

import { ProgressHeader } from './ProgressHeader';

type Props = {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  skippable?: boolean;
  onSkip?: () => void;
  scroll?: boolean;
  children: ReactNode;
};

export function ProfileStepLayout({
  step,
  total = 9,
  title,
  subtitle,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = true,
  skippable = false,
  onSkip,
  scroll = true,
  children,
}: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ProgressHeader step={step} total={total} onBack={onBack} />
        <AppText variant="title">{title}</AppText>
        {subtitle ? <AppText tone="textSecondary">{subtitle}</AppText> : null}
      </View>
      {scroll ? (
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
      <View style={styles.footer}>
        {skippable && onSkip ? (
          <AuthTextButton label="Skip" onPress={onSkip} />
        ) : (
          <View />
        )}
        <AuthPrimaryButton label={continueLabel} onPress={onContinue} disabled={continueDisabled} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.sm,
  },
  header: {
    gap: space.xs,
    paddingTop: space.xxs,
  },
  body: {
    flex: 1,
    paddingTop: space.sm,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: space.sm,
    paddingBottom: space.sm,
    gap: space.sm,
  },
  footer: {
    gap: space.xs,
    paddingVertical: space.sm,
  },
});
