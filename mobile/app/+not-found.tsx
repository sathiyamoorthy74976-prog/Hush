import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { space } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: true }} />
      <Screen>
        <AppText variant="heading">This screen does not exist.</AppText>
        <Link href="/" style={styles.link} accessibilityRole="link">
          <AppText tone="brand">Go home</AppText>
        </Link>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    paddingVertical: space.sm,
  },
});
