import { useRouter } from 'expo-router';

import { profileHref, PROFILE_FIRST_ROUTE } from '@/navigation/ProfileStack';
import { AppText } from '@/components/ui';

import { PermissionScreen } from '@/components/auth';

export default function PersonalizationScreen() {
  const router = useRouter();

  return (
    <PermissionScreen
      icon={
        <AppText style={{ fontSize: 64, lineHeight: 72 }}>✌️</AppText>
      }
      title="Let's make this about you"
      body="We always want to improve your experience, so we use tracking to show you relevant ads."
      primaryLabel="Continue"
      onPrimary={() => router.push(profileHref(PROFILE_FIRST_ROUTE))}
      footer="Make changes in device settings at any time. Learn more in our privacy policy."
    />
  );
}
