import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, BlurAvatar, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { space } from '@/theme';

export default function DecisionScreen() {
  const router = useRouter();
  const setMyChoice = useGameStore((s) => s.setMyChoice);

  return (
    <Screen>
      <AppText variant="title">Keep them?</AppText>
      <AppText tone="textSecondary">Private pick. They won’t see Pass.</AppText>
      <View style={styles.row}>
        <BlurAvatar size={120} stage={5} label="Rae" />
      </View>
      <Button
        label="Match"
        variant="green"
        onPress={() => {
          setMyChoice('match');
          router.replace('/waiting');
        }}
      />
      <Button
        label="Pass"
        variant="ghost"
        onPress={() => {
          setMyChoice('pass');
          router.replace('/pass');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', paddingVertical: space.lg },
});
