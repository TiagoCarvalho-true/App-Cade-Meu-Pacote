import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { RegisterScreenProps } from '../navigation/types';

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Cadastro</Text>

        <CustomInput
          iconName="account-outline"
          iconColor={Colors.primary}
          placeholder="Nome de Usuário"
          value={username}
          onChangeText={setUsername}
        />

        <CustomInput
          iconName="email-outline"
          iconColor={Colors.primary}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          iconName="key-variant"
          iconColor={Colors.primary}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomInput
          iconName="lock-outline"
          iconColor={Colors.primary}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <CustomButton
          title="Registrar"
          onPress={() => navigation.navigate('Home')}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Sizes.h1,
    color: Colors.white,
    alignSelf: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RegisterScreen;