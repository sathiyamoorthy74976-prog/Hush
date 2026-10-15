import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

import { PermissionScreen } from '@/components/auth';
import { useTheme } from '@/theme';

export default function LocationScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const onPrimary = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // prototype: continue even if permission fails
    }
    router.push('/auth/notifications');
  };

  return (
    <PermissionScreen
      icon={<Ionicons name="globe-outline" size={72} color={colors.brand} />}
      title="Now, can we get your location?"
      body="We need it so we can show you all the great people nearby (or far away)."
      primaryLabel="Set location services"
      onPrimary={onPrimary}
    />
  );
}
