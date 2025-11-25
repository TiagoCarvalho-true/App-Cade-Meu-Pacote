import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  background: '#1C1C1E',
  primary: '#E9407A',
  white: '#FFFFFF',
  gray: '#3A3A3C',
  lightGray: '#AEAEB2',
  darkRed: '#7B113A',
  red: '#FF3B30',
  green: '#1E7E34',
  yellow: '#B38B00',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  width,
  height,
};

export const FONTS = {
  bold: 'Poppins_700Bold',
  regular: 'Poppins_400Regular',
  h1: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: 'Poppins_400Regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Poppins_400Regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Poppins_400Regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Poppins_400Regular', fontSize: SIZES.body4, lineHeight: 22 },
};
export const Colors = COLORS;
export const Sizes = SIZES;
export const Fonts = FONTS;

const temaApp = { COLORS, SIZES, FONTS };
export default temaApp;