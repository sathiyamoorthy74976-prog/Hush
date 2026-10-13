import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { space, useTheme } from '@/theme';

const CARDS = [
  {
    emoji: '👻',
    title: 'Stay anonymous',
    body: 'Meet a stranger from campus. Their face stays blurred until you actually talk.',
  },
  {
    emoji: '⚡',
    title: 'Fill the Spark',
    body: 'Five chat stages. Tags, answers, then a slow unblur. No skip, no paywall.',
  },
  {
    emoji: '🤝',
    title: 'Match or Pass',
    body: 'When Spark is full, you both pick in private. Only a mutual Match keeps the chat.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [page, setPage] = useState(0);
  const card = CARDS[page];

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <AppText variant="caption" tone="brand">
          {APP_NAME}
        </AppText>
        <AppText variant="display">{card.emoji}</AppText>
        <AppText variant="title">{card.title}</AppText>
        <AppText tone="textSecondary" style={{ textAlign: 'center' }}>
          {card.body}
        </AppText>
      </View>
      <View style={styles.dots}>
        {CARDS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: colors.text, opacity: i === page ? 1 : 0.25 }]}
          />
        ))}
      </View>
      <Card tint>
        <AppText variant="caption">{APP_TAGLINE}</AppText>
      </Card>
      <Button
        label={page < 2 ? 'Next' : "I'm in"}
        onPress={() => (page < 2 ? setPage(page + 1) : router.push('/signup'))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingHorizontal: space.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
