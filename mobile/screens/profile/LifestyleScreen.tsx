import { StyleSheet, View } from 'react-native';

import { LifestyleGroup, ProfileStepLayout } from '@/components/profile';
import { LIFESTYLE_GROUPS } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function LifestyleScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('lifestyle');
  const lifestyle = useProfileDraftStore((s) => s.lifestyle);
  const setLifestyle = useProfileDraftStore((s) => s.setLifestyle);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Quick habits — helps matches know your rhythm. Skip if you would rather not share."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <View style={styles.groups}>
        {LIFESTYLE_GROUPS.map((group) => (
          <LifestyleGroup
            key={group.key}
            label={group.label}
            options={group.options}
            value={lifestyle[group.key]}
            onSelect={(v) => setLifestyle(group.key, v)}
          />
        ))}
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  groups: { gap: space.md },
});
