import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Button, Chip, Input, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { space } from '@/theme';

const TAGS = ['Music', 'Late nights', 'Studio', 'Startups', 'Gym', 'Anime', 'Coffee', 'Design'];

export default function SignupScreen() {
  const router = useRouter();
  const { nickname, setNickname, interests, toggleInterest } = useGameStore();
  const [otp, setOtp] = useState('');
  const [selfieOk, setSelfieOk] = useState(false);

  return (
    <Screen>
      <AppText variant="title">Create your hush</AppText>
      <AppText tone="textSecondary">Campus phone. A nickname. Then a quick selfie check.</AppText>
      <Input label="OTP code" keyboardType="number-pad" value={otp} onChangeText={setOtp} placeholder="000000" />
      <Input label="Nickname" value={nickname} onChangeText={setNickname} placeholder="Nova" />
      <AppText variant="caption">Interests</AppText>
      <View style={styles.wrap}>
        {TAGS.map((tag) => (
          <Chip key={tag} label={tag} selected={interests.includes(tag)} onPress={() => toggleInterest(tag)} />
        ))}
      </View>
      <Button
        label={selfieOk ? 'Selfie checked ✓' : 'Take selfie check'}
        variant={selfieOk ? 'green' : 'ghost'}
        onPress={() => setSelfieOk(true)}
      />
      <Button
        label="Enter campus"
        disabled={!otp || !nickname || !selfieOk}
        onPress={() => router.replace('/(tabs)')}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});

