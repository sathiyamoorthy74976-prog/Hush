import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProfileStepLayout, ReactionPicker } from '@/components/profile';
import { AppText, Chip } from '@/components/ui';
import { INTEREST_TAGS } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function InterestsScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('interests');
  const interests = useProfileDraftStore((s) => s.interests);
  const toggleInterest = useProfileDraftStore((s) => s.toggleInterest);
  const setInterestReaction = useProfileDraftStore((s) => s.setInterestReaction);
  const selected = Object.keys(interests);
  const count = selected.length;
  const topSet = useMemo(() => {
    const entries = Object.entries(interests);
    entries.sort((a, b) => b[1].score - a[1].score);
    return new Set(entries.slice(0, 3).map(([name]) => name));
  }, [interests]);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Pick 5–10 things you actually care about. Rate each so we know your top 3."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <AppText variant="caption" tone="textSecondary">{count}/10 selected · need at least 5</AppText>
      <View style={styles.chips}>
        {INTEREST_TAGS.map((tag) => {
          const isSelected = tag in interests;
          const atMax = count >= 10 && !isSelected;
          return (
            <Chip
              key={tag}
              label={tag}
              selected={isSelected}
              onPress={() => !atMax && toggleInterest(tag)}
            />
          );
        })}
      </View>
      {selected.length > 0 ? (
        <View style={styles.reactions}>
          {selected.map((tag) => (
            <View key={tag} style={styles.reactionBlock}>
              <View style={styles.reactionHeader}>
                <AppText variant="heading">{tag}</AppText>
                {topSet.has(tag) && interests[tag]?.reaction ? (
                  <AppText variant="caption" tone="textSecondary">Top 3</AppText>
                ) : null}
              </View>
              <ReactionPicker
                value={interests[tag]?.reaction}
                onChange={(r) => setInterestReaction(tag, r)}
              />
            </View>
          ))}
        </View>
      ) : null}
    </ProfileStepLayout>
  );
}
const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  reactions: { gap: space.sm },
  reactionBlock: { gap: space.xs },
  reactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

