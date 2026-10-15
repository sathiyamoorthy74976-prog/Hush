import { StyleSheet, View } from 'react-native';

import { PhotoSlot, ProfileStepLayout } from '@/components/profile';
import { AppText, Input } from '@/components/ui';
import type { LifePhoto } from '@/store/profileDraft';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space } from '@/theme';

import { pickLifePhoto } from './pickProfileImage';
import { useProfileStepNavigation } from './useProfileStepNavigation';

export function LifePhotosScreen() {
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('life-photos');
  const lifePhotos = useProfileDraftStore((s) => s.lifePhotos);
  const setLifePhotos = useProfileDraftStore((s) => s.setLifePhotos);

  const addPhoto = async () => {
    if (lifePhotos.length >= 6) return;
    const uri = await pickLifePhoto();
    if (uri) setLifePhotos([...lifePhotos, { uri }]);
  };

  const removePhoto = (index: number) => {
    setLifePhotos(lifePhotos.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setLifePhotos(
      lifePhotos.map((p, i) => (i === index ? { ...p, caption } : p)),
    );
  };

  const slots: (LifePhoto | null)[] = [...lifePhotos];
  while (slots.length < 6) slots.push(null);

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Add 3–6 photos of you out living — optional caption for place or activity."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <AppText variant="caption" tone="textSecondary">{lifePhotos.length}/6 · need at least 3</AppText>
      <View style={styles.grid}>
        {slots.map((photo, index) => {
          if (photo) {
            return (
              <PhotoSlot
                key={`${photo.uri}-${index}`}
                uri={photo.uri}
                size={100}
                onRemove={() => removePhoto(index)}
              />
            );
          }
          if (index === lifePhotos.length && lifePhotos.length < 6) {
            return <PhotoSlot key="add" size={100} onAdd={addPhoto} label="Add" />;
          }
          return <View key={`empty-${index}`} style={{ width: 100, height: 100 }} />;
        })}
      </View>
      {lifePhotos.map((photo, index) => (
        <Input
          key={photo.uri}
          label={`Caption ${index + 1} (optional)`}
          value={photo.caption ?? ''}
          onChangeText={(t) => updateCaption(index, t)}
          placeholder="Coffee shop, game night, hike…"
        />
      ))}
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
