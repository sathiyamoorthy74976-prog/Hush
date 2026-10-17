import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { AppText, BlurAvatar, Button, Screen } from '@/components/ui';
import { useGameStore } from '@/store/game';
import { radii, space, useTheme } from '@/theme';

const MATCH_NAME = 'Rae';

export default function DecisionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setMyChoice = useGameStore((s) => s.setMyChoice);

  return (
    <Screen scroll={false}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <AppText variant="title">Keep them?</AppText>
            <AppText tone="textMuted">Private pick. They won&apos;t see Pass.</AppText>
          </View>
          <View
            style={[styles.settingsButton, { backgroundColor: colors.textMuted }]}
            accessibilityLabel="Settings"
            accessibilityRole="image"
          >
            <Ionicons name="settings-outline" size={22} color={colors.onInverse} />
          </View>
        </View>

        <View style={styles.profile}>
          <BlurAvatar size={120} stage={5} label={MATCH_NAME} />
        </View>

        <View style={styles.actions}>
          <Button
            label="Match"
            variant="green"
            onPress={() => {
              setMyChoice('match');
              router.replace({
                pathname: '/match-found',
                params: { after: 'waiting' },
              });
            }}
          />
          <Button label="Pass" variant="ghost" onPress={() => {
            setMyChoice('pass');
            router.replace('/pass');
          }} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: space.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  headerCopy: {
    flex: 1,
    gap: space.xxs,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  profile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.lg,
  },
  actions: {
    gap: space.xs,
    paddingBottom: space.sm,
  },
});
