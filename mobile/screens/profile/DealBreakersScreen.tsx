import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileStepLayout } from '@/components/profile';
import { AppText, Card } from '@/components/ui';
import { DEAL_BREAKER_QUESTIONS } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { radii, space, useTheme } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function DealBreakersScreen() {
  const { colors } = useTheme();
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('deal-breakers');
  const dealBreakers = useProfileDraftStore((s) => s.dealBreakers);
  const toggleDealBreakerQuestion = useProfileDraftStore((s) => s.toggleDealBreakerQuestion);
  const setDealBreakerAcceptable = useProfileDraftStore((s) => s.setDealBreakerAcceptable);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Choose what matches must answer. Mark each as a preference or a hard deal-breaker."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      {DEAL_BREAKER_QUESTIONS.map((q) => {
        const entry = dealBreakers.find((e) => e.questionId === q.id);
        const selected = !!entry;
        return (
          <View key={q.id} style={styles.block}>
            <Pressable accessibilityRole="button" onPress={() => toggleDealBreakerQuestion(q.id)}>
              <Card tint={selected}>
                <AppText variant="heading">{q.label}</AppText>
                <AppText variant="caption" tone="textSecondary">
                  {selected ? 'Added to your profile' : 'Tap to require an answer'}
                </AppText>
              </Card>
            </Pressable>
            {selected && entry ? (
              <View style={styles.segment}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDealBreakerAcceptable(q.id, true)}
                  style={[
                    styles.segBtn,
                    {
                      backgroundColor: entry.acceptable ? colors.brand : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AppText variant="caption">Acceptable diff</AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDealBreakerAcceptable(q.id, false)}
                  style={[
                    styles.segBtn,
                    {
                      backgroundColor: !entry.acceptable ? colors.text : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AppText variant="caption" tone={!entry.acceptable ? 'onInverse' : 'text'}>
                    Deal-breaker
                  </AppText>
                </Pressable>
              </View>
            ) : null}
          </View>
        );
      })}
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  block: { gap: space.xs },
  segment: {
    flexDirection: 'row',
    gap: space.xs,
  },
  segBtn: {
    flex: 1,
    paddingVertical: space.xs,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
});
