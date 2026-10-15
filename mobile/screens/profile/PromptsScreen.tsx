import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileStepLayout } from '@/components/profile';
import { AppText, Card, Input } from '@/components/ui';
import { PROMPT_TEMPLATES } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function PromptsScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('prompts');
  const prompts = useProfileDraftStore((s) => s.prompts);
  const setPrompts = useProfileDraftStore((s) => s.setPrompts);

  const selectedIds = new Set(prompts.map((p) => p.promptId));

  const togglePrompt = (promptId: string) => {
    if (selectedIds.has(promptId)) {
      setPrompts(prompts.filter((p) => p.promptId !== promptId));
      return;
    }
    if (prompts.length >= 3) return;
    setPrompts([...prompts, { promptId, answer: '' }]);
  };

  const updateAnswer = (promptId: string, answer: string) => {
    const template = PROMPT_TEMPLATES.find((p) => p.id === promptId);
    const max = template?.maxChars ?? 150;
    setPrompts(
      prompts.map((p) => (p.promptId === promptId ? { ...p, answer: answer.slice(0, max) } : p)),
    );
  };

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Pick 1–3 prompts and answer in your voice. Skip if you want to add these later."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <AppText variant="caption" tone="textSecondary">{prompts.length}/3 prompts</AppText>
      {PROMPT_TEMPLATES.map((template) => {
        const active = selectedIds.has(template.id);
        const answer = prompts.find((p) => p.promptId === template.id)?.answer ?? '';
        const atMax = prompts.length >= 3 && !active;
        return (
          <View key={template.id} style={styles.block}>
            <Pressable
              accessibilityRole="button"
              disabled={atMax}
              onPress={() => togglePrompt(template.id)}
              style={{ opacity: atMax ? 0.45 : 1 }}
            >
              <Card tint={active}>
                <AppText variant="heading">{template.question}</AppText>
                <AppText variant="caption" tone="textSecondary">
                  {active ? 'Selected' : 'Tap to add'}
                </AppText>
              </Card>
            </Pressable>
            {active ? (
              <View>
                <Input
                  label="Your answer"
                  multiline
                  value={answer}
                  onChangeText={(t) => updateAnswer(template.id, t)}
                  placeholder="Type something real…"
                />
                <AppText variant="caption" tone="textMuted" style={styles.counter}>
                  {answer.length}/{template.maxChars}
                </AppText>
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
  counter: { textAlign: 'right', marginTop: -space.xs },
});
