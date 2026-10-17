import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip } from '@/components/ui';
import { LOOKING_FOR_OPTIONS } from '@/constants/profileOptions';
import type { DiscoverFilterPrefs } from '@/types/discover';
import { space, useTheme } from '@/theme';

import { DraggableSheet } from './DraggableSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: DiscoverFilterPrefs;
  onChange: (next: DiscoverFilterPrefs) => void;
};

const AGE_OPTIONS = [
  { label: '18–22', min: 18, max: 22 },
  { label: '20–24', min: 20, max: 24 },
  { label: '22–26', min: 22, max: 26 },
];

const DISTANCE_OPTIONS = [5, 10, 25];

export function FilterSheet({ visible, onClose, filters, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <DraggableSheet visible={visible} onClose={onClose} title="Filters">
      <View style={styles.content}>
        <AppText variant="heading">Age range</AppText>
        <View style={styles.row}>
          {AGE_OPTIONS.map((opt) => {
            const selected = filters.ageMin === opt.min && filters.ageMax === opt.max;
            return (
              <Chip
                key={opt.label}
                label={opt.label}
                selected={selected}
                onPress={() => onChange({ ...filters, ageMin: opt.min, ageMax: opt.max })}
              />
            );
          })}
        </View>

        <AppText variant="heading">Distance</AppText>
        <View style={styles.row}>
          {DISTANCE_OPTIONS.map((km) => (
            <Chip
              key={km}
              label={`${km} km`}
              selected={filters.maxDistanceKm === km}
              onPress={() => onChange({ ...filters, maxDistanceKm: km })}
            />
          ))}
        </View>

        <AppText variant="heading">Looking for</AppText>
        <View style={styles.row}>
          {LOOKING_FOR_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              label={opt.title}
              selected={filters.lookingFor === opt.id}
              onPress={() => onChange({ ...filters, lookingFor: opt.id })}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply filters"
          onPress={onClose}
          style={[styles.apply, { backgroundColor: colors.brand }]}
        >
          <AppText variant="heading" style={{ color: colors.onBrand }}>Apply</AppText>
        </Pressable>
      </View>
    </DraggableSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    gap: space.sm,
    paddingBottom: space.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  apply: {
    marginTop: space.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderRadius: 999,
  },
});
