import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Sizes } from '../constants/theme';

interface PackageItemProps {
  storeIcon: any;
  title: string;
  subtitle: string;
  onPressInfo: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const PackageItem: React.FC<PackageItemProps> = ({ storeIcon, title, subtitle, onPressInfo, containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={storeIcon} style={styles.storeIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onPressInfo}>
        <Icon name="information-outline" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.base * 1.5,
    borderRadius: Sizes.radius,
    marginBottom: Sizes.base,
    backgroundColor: Colors.gray,
  },
  storeIcon: {
    width: 44,
    height: 44,
    borderRadius: Sizes.base,
    marginRight: Sizes.base * 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: 16,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    fontSize: 14,
  },
});

export default PackageItem;