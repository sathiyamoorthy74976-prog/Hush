import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '@/theme';

type Props = {
  enabled: boolean;
  onPress: () => void;
};

export function RoundForwardButton({ enabled, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue"
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      style={[
        styles.circle,
        { backgroundColor: enabled ? colors.text : colors.disabledBg },
      ]}
    >
      <Ionicons name="chevron-forward" size={22} color={enabled ? colors.onInverse : colors.disabledText} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

