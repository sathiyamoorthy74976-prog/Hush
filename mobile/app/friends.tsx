import { AppText, Button, Card, Screen } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function FriendsScreen() {
  const router = useRouter();

  return (
    <Screen>
      <AppText variant="title">Friends & squads</AppText>
      <Card tint>
        <AppText variant="heading">🔥 Squad streak 4</AppText>
        <AppText tone="textSecondary">Ivy and you both showed up today. Shared flame.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Kenji</AppText>
        <AppText tone="textMuted">Mutual match · in Ruby with you</AppText>
      </Card>
      <Button label="Back" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
