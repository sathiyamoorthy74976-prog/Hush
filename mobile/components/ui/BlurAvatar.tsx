import { Image, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  size?: number;
  stage: number;
  label?: string;
};

const PHOTO = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80';

export function BlurAvatar({ size = 88, stage, label }: Props) {
  const { colors } = useTheme();
  const blur =
    stage <= 0 ? 28 : stage === 1 ? 24 : stage === 2 ? 20 : stage === 3 ? 12 : stage === 4 ? 4 : 0;
  const opacity = stage <= 2 ? 0.55 : 1;

  return (
    <View style={{ width: size, alignItems: 'center', gap: 6 }}>
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderColor: colors.text, backgroundColor: colors.tint },
        ]}
      >
        {stage >= 3 ? (
          <Image
            source={{ uri: PHOTO }}
            style={{ width: size - 6, height: size - 6, borderRadius: (size - 6) / 2, opacity }}
            blurRadius={blur}
          />
        ) : (
          <View
            style={[
              styles.silhouette,
              { width: size * 0.55, height: size * 0.55, backgroundColor: colors.textMuted, opacity: 0.45 },
            ]}
          />
        )}
      </View>
      {label && stage >= 4 ? (
        <AppText variant="heading">{label}</AppText>
      ) : label ? (
        <AppText variant="caption" tone="textMuted">
          ???
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderRadius: 999,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  silhouette: {
    borderRadius: 999,
  },
});
