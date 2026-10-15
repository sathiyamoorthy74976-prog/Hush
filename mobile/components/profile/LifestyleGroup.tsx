import { StyleSheet, View } from 'react-native';

import { Chip, AppText } from '@/components/ui';
import type { LifestyleChoice, LifestyleState } from '@/store/profileDraft';
import { space } from '@/theme';

type Props = {
  label: string;
  options: { id: string; label: string }[];
  value: LifestyleState[keyof LifestyleState];
  onSelect: (value: LifestyleChoice) => void;
};

export function LifestyleGroup({ label, options, value, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="caption">{label}</AppText>
      <View style={styles.chips}>
        {options.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={value === opt.id}
            onPress={() => onSelect(opt.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
