import { StyleSheet, View } from 'react-native';

import { ProfileStepLayout, SelectableOptionCard } from '@/components/profile';
import { FAMILY_PLANS_OPTIONS } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function FamilyPlansScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('family-plans');
  const familyPlans = useProfileDraftStore((s) => s.familyPlans);
  const setFamilyPlans = useProfileDraftStore((s) => s.setFamilyPlans);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="No wrong answers — just be honest about where you are."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <View style={styles.list}>
        {FAMILY_PLANS_OPTIONS.map((opt) => (
          <SelectableOptionCard
            key={opt.id}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={familyPlans === opt.id}
            onPress={() => setFamilyPlans(opt.id)}
          />
        ))}
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
});
