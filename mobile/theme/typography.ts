export const fonts = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

export const typeScale = {
  display: { fontSize: 34, lineHeight: 40, fontFamily: fonts.extraBold },
  title: { fontSize: 26, lineHeight: 32, fontFamily: fonts.extraBold },
  heading: { fontSize: 18, lineHeight: 24, fontFamily: fonts.bold },
  body: { fontSize: 16, lineHeight: 22, fontFamily: fonts.regular },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fonts.bold },
} as const;

export type TypeVariant = keyof typeof typeScale;
