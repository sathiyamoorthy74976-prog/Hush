import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { InterestReaction } from '@/store/profileDraft';
import { radii, space, useTheme } from '@/theme';

const REACTIONS: { id: InterestReaction; emoji: string; label: string }[] = [
  { id: 'obsessed', emoji: '🔥', label: 'Obsessed' },
  { id: 'like', emoji: '😊', label: 'Like' },
  { id: 'casual', emoji: '🙂', label: 'Casual' },
];

type Props = {
  value?: InterestReaction;
  onChange: (reaction: InterestReaction) => void;
};

export function ReactionPicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {REACTIONS.map((r) => {
        const selected = value === r.id;
        return (
          <Pressable
            key={r.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(r.id);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.brand : colors.surface,
                borderColor: selected ? colors.text : colors.border,
              },
            ]}
          >
            <AppText>{r.emoji}</AppText>
            <AppText variant="caption" tone={selected ? 'text' : 'textSecondary'}>{r.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.xs,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space.xs,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
});
