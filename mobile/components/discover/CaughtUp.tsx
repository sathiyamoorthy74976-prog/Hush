import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

type Props = {
  height: number;
};

export function CaughtUp({ height }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { height }]}>
      <Ionicons name="sparkles" size={40} color={colors.brand} />
      <AppText variant="title" style={styles.title}>You’re all caught up</AppText>
      <AppText tone="textMuted" style={styles.body}>
        New people drop in through the day. Pull to refresh or check back later.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    gap: space.sm,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
});
