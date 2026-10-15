import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';

import { ProfileStepLayout } from '@/components/profile';
import { AppText, Button } from '@/components/ui';
import { useProfileDraftStore } from '@/store/profileDraft';
import { radii, space, useTheme } from '@/theme';

import { pickImageFromGallery } from './pickProfileImage';
import { useProfileStepNavigation } from './useProfileStepNavigation';

export function ProfilePictureScreen() {
  const { colors } = useTheme();
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('profile-picture');
  const uri = useProfileDraftStore((s) => s.profilePictureUri);
  const setProfilePictureUri = useProfileDraftStore((s) => s.setProfilePictureUri);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setCameraOpen(true);
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
    if (photo?.uri) {
      setProfilePictureUri(photo.uri);
      setCameraOpen(false);
    }
  };

  const pickGallery = async () => {
    const picked = await pickImageFromGallery();
    if (picked) setProfilePictureUri(picked);
  };

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Show your face clearly — it unblurs in stages as you chat. No filters needed."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
    >
      <View style={[styles.preview, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        ) : (
          <AppText tone="textMuted">No photo yet</AppText>
        )}
      </View>
      <View style={styles.actions}>
        <Button label="Take selfie" onPress={openCamera} />
        <Button label="Choose from gallery" variant="ghost" onPress={pickGallery} />
        {uri ? (
          <Button label="Retake" variant="ghost" onPress={() => setProfilePictureUri(null)} />
        ) : null}
      </View>

      <Modal visible={cameraOpen} animationType="slide">
        <View style={styles.cameraWrap}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />
          <View style={styles.cameraBar}>
            <Button label="Cancel" variant="ghost" onPress={() => setCameraOpen(false)} />
            <Button label="Capture" onPress={takePhoto} />
          </View>
        </View>
      </Modal>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    alignSelf: 'center',
    borderRadius: radii.lg,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  actions: { gap: space.xs },
  cameraWrap: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space.sm,
    gap: space.sm,
  },
});
