import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, BlurAvatar, Button, Card, Screen } from '@/components/ui';
import { space } from '@/theme';

export default function MatchFoundScreen() {
  const router = useRouter();

  return (
    <Screen>
      <AppText variant="title">You’re in</AppText>
      <View style={styles.row}>
        <BlurAvatar size={96} stage={0} label="You" />
        <AppText variant="display">⚡</AppText>
        <BlurAvatar size={96} stage={0} label="Them" />
      </View>
      <Card tint>
        <AppText variant="caption">Icebreaker</AppText>
        <AppText variant="heading">Two truths and a campus myth — you first?</AppText>
      </Card>
      <Button label="Start chat" onPress={() => router.replace('/chat')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: space.md },
});
