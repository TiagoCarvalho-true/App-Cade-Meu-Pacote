import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
  iconName: string;
  iconColor?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ iconName, iconColor, ...props }) => {
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={22} color={iconColor || Colors.lightGray} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.lightGray}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});

export default CustomInput;