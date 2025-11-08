import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const Colors = {
  background: '#1C1C1E',
  primary: '#E9407A',
  white: '#FFFFFF',
  gray: '#3A3A3C',
  lightGray: '#AEAEB2',
  darkRed: '#7B113A',
  red: '#FF3B30',
  // Novas cores para os status
  green: '#1E7E34',
  yellow: '#B38B00',
};

export const Sizes = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,

  width,
  height,
};

export const Fonts = {
  bold: 'Poppins_700Bold',
  regular: 'Poppins_400Regular',
};