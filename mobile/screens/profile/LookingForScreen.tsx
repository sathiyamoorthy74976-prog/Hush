import { StyleSheet, View } from 'react-native';

import { ProfileStepLayout, SelectableOptionCard } from '@/components/profile';
import { LOOKING_FOR_OPTIONS } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function LookingForScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('looking-for');
  const lookingFor = useProfileDraftStore((s) => s.lookingFor);
  const setLookingFor = useProfileDraftStore((s) => s.setLookingFor);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="What kind of connection are you hoping to find on campus?"
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <View style={styles.list}>
        {LOOKING_FOR_OPTIONS.map((opt) => (
          <SelectableOptionCard
            key={opt.id}
            emoji={opt.emoji}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={lookingFor === opt.id}
            onPress={() => setLookingFor(opt.id)}
          />
        ))}
      </View>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
});
