import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthPrimaryButton } from '@/components/auth';
import { AppText, Card, Chip } from '@/components/ui';
import {
  familyPlansLabel,
  getPromptQuestion,
  lifestyleSummary,
  lookingForLabel,
} from '@/constants/profileOptions';
import { space, useTheme } from '@/theme';
import { useGameStore } from '@/store/game';
import { useProfileDraftStore } from '@/store/profileDraft';

export function ProfilePreviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const draft = useProfileDraftStore();
  const topInterests = draft.getTopInterests();
  const displayInterests = topInterests.length > 0 ? topInterests : Object.keys(draft.interests).slice(0, 3);
  const hardBreakers = draft.dealBreakers.filter((d) => !d.acceptable).length;

  const onFinish = () => {
    draft.markCompleted();
    const game = useGameStore.getState();
    displayInterests.forEach((tag) => {
      if (!game.interests.includes(tag)) {
        game.toggleInterest(tag);
      }
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="title">Profile preview</AppText>
        <AppText tone="textSecondary">This is what others will see once you are live on campus.</AppText>

        <Card>
          {draft.profilePictureUri ? (
            <Image source={{ uri: draft.profilePictureUri }} style={styles.hero} contentFit="cover" />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: colors.surface }]}>
              <AppText tone="textMuted">No photo</AppText>
            </View>
          )}
          <AppText variant="heading">{lookingForLabel(draft.lookingFor) || 'Your vibe'}</AppText>
          <AppText tone="textSecondary">{familyPlansLabel(draft.familyPlans)}</AppText>
          {displayInterests.length > 0 ? (
            <View style={styles.chips}>
              {displayInterests.map((tag) => (
                <Chip key={tag} label={tag} selected />
              ))}
            </View>
          ) : null}
          <AppText variant="caption" tone="textSecondary">{lifestyleSummary(draft.lifestyle)}</AppText>
        </Card>

        {draft.values.length > 0 ? (
          <Card>
            <AppText variant="heading">Values</AppText>
            {draft.values.map((v, i) => (
              <AppText key={v} tone="textSecondary">{i + 1}. {v}</AppText>
            ))}
          </Card>
        ) : null}

        {draft.prompts.length > 0 ? (
          <Card>
            <AppText variant="heading">Prompts</AppText>
            {draft.prompts.map((p) => (
              <View key={p.promptId} style={styles.promptBlock}>
                <AppText variant="caption" tone="textMuted">{getPromptQuestion(p.promptId)}</AppText>
                <AppText>{p.answer}</AppText>
              </View>
            ))}
          </Card>
        ) : null}

        {draft.dealBreakers.length > 0 ? (
          <Card>
            <AppText variant="heading">Match filters</AppText>
            <AppText tone="textSecondary">
              {draft.dealBreakers.length} question{draft.dealBreakers.length === 1 ? '' : 's'}
              {hardBreakers > 0 ? ` · ${hardBreakers} deal-breaker${hardBreakers === 1 ? '' : 's'}` : ''}
            </AppText>
          </Card>
        ) : null}

        {draft.lifePhotos.length > 0 ? (
          <Card>
            <AppText variant="heading">Life photos</AppText>
            <View style={styles.thumbs}>
              {draft.lifePhotos.map((p) => (
                <View key={p.uri} style={styles.thumbWrap}>
                  <Image source={{ uri: p.uri }} style={styles.thumb} contentFit="cover" />
                  {p.caption ? (
                    <AppText variant="caption" tone="textSecondary" numberOfLines={1}>{p.caption}</AppText>
                  ) : null}
                </View>
              ))}
            </View>
          </Card>
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <AuthPrimaryButton label="Finish" onPress={onFinish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.sm,
  },
  content: {
    gap: space.sm,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  heroPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  promptBlock: { gap: 4 },
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  thumbWrap: { width: 96, gap: 4 },
  thumb: {
    width: 96,
    height: 120,
    borderRadius: 8,
  },
  footer: {
    paddingVertical: space.sm,
  },
});
