import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { fonts, minTapTarget, radii, space, useTheme } from '@/theme';

import { AppText } from './AppText';

type Props = TextInputProps & { label: string };

export function Input({ label, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <AppText variant="caption" tone="textMuted">
        {label}
      </AppText>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          style,
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  input: {
    minHeight: minTapTarget,
    borderRadius: radii.lg,
    paddingHorizontal: space.sm,
    fontFamily: fonts.bold,
    fontSize: 16,
    borderWidth: 1,
    borderBottomWidth: 2,
  },
});

