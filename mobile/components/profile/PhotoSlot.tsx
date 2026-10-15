import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, space, useTheme } from '@/theme';

type Props = {
  uri?: string | null;
  onAdd?: () => void;
  onRemove?: () => void;
  label?: string;
  size?: number;
};

export function PhotoSlot({ uri, onAdd, onRemove, label = 'Add photo', size = 100 }: Props) {
  const { colors } = useTheme();

  if (uri) {
    return (
      <View style={[styles.slot, { width: size, height: size }]}>
        <Image source={{ uri }} style={styles.image} contentFit="cover" />
        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
            onPress={onRemove}
            style={[styles.remove, { backgroundColor: colors.text }]}
          >
            <Ionicons name="close" size={16} color={colors.bg} />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onAdd}
      style={[
        styles.empty,
        {
          width: size,
          height: size,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <Ionicons name="add" size={28} color={colors.textMuted} />
      <AppText variant="caption" tone="textMuted">{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: space.xxs,
  },
});
