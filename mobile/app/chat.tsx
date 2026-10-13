import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, BlurAvatar, Button, Card, Chip, Input, Screen, SparkMeter } from '@/components/ui';
import { SPARK_STAGES, useGameStore } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

const TAGS = ['Late nights', 'Playlists', 'Studio'];

export default function ChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { stage, bumpSpark, setSparkStage } = useGameStore();
  const [text, setText] = useState('');
  const [lines, setLines] = useState([
    { me: false, t: 'okay but midnight city is a personality' },
    { me: true, t: 'window seat truth. rain optional.' },
  ]);

  const send = () => {
    if (!text.trim()) return;
    setLines((l) => [...l, { me: true, t: text.trim() }]);
    setText('');
    bumpSpark();
  };

  return (
    <Screen scroll={false}>
      <View style={styles.head}>
        <BlurAvatar size={52} stage={stage} label={stage >= 4 ? 'Rae' : undefined} />
        <View style={{ flex: 1 }}>
          <SparkMeter
            stage={stage}
            onPress={() => setSparkStage(stage >= SPARK_STAGES ? SPARK_STAGES : stage + 1)}
          />
        </View>
      </View>

      {stage >= 1 ? (
        <View style={styles.tags}>
          {TAGS.map((tag) => (
            <Chip key={tag} label={tag} selected />
          ))}
        </View>
      ) : null}
      {stage >= 2 ? (
        <Card>
          <AppText variant="caption">Their QOTD</AppText>
          <AppText variant="heading">Last replay: Midnight City — on the walk home.</AppText>
        </Card>
      ) : null}

      <ScrollView style={styles.thread} contentContainerStyle={{ gap: 8 }}>
        {lines.map((m, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              {
                alignSelf: m.me ? 'flex-end' : 'flex-start',
                backgroundColor: m.me ? colors.brand : colors.surface,
                borderColor: colors.text,
              },
            ]}
          >
            <AppText tone={m.me ? 'onBrand' : 'text'}>{m.t}</AppText>
          </View>
        ))}
      </ScrollView>

      {stage >= SPARK_STAGES ? (
        <Button label="Time to decide" onPress={() => router.push('/decision')} />
      ) : (
        <View style={styles.compose}>
          <View style={{ flex: 1 }}>
            <Input label="Message" value={text} onChangeText={setText} placeholder="Say something real" />
          </View>
          <Button label="Send" onPress={send} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  thread: { flex: 1 },
  bubble: {
    maxWidth: '80%',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compose: { flexDirection: 'row', alignItems: 'flex-end', gap: space.xs },
});
