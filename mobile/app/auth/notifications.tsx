import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { PermissionScreen } from '@/components/auth';
import { useTheme } from '@/theme';

/** Expo Go cannot load expo-notifications (SDK 53+); skip until a dev build. */
async function requestNotificationPermission() {
  if (Constants.appOwnership === 'expo') return;

  try {
    const Notifications = await import('expo-notifications');
    await Notifications.requestPermissionsAsync();
  } catch {
    // prototype / unsupported runtime
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const goNext = () => router.push('/auth/personalization');

  const onAllow = async () => {
    await requestNotificationPermission();
    goNext();
  };

  return (
    <PermissionScreen
      icon={<Ionicons name="notifications-outline" size={72} color={colors.brand} />}
      title="Don't miss a beat, or a match"
      body="Turn on your notifications so we can let you know when you have new matches, likes, or messages."
      primaryLabel="Allow notifications"
      onPrimary={onAllow}
      secondaryLabel="Not now"
      onSecondary={goNext}
    />
  );
}
