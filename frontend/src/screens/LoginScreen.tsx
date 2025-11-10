import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { LoginScreenProps } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    const success = await login(email, password);

    // A navegação agora será controlada pelo AppNavigator,
    // que reagirá à mudança de estado no AuthContext.
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Login</Text>

        <CustomInput
          iconName="email-outline"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          iconName="key-variant"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu Sua Senha?</Text>
        </TouchableOpacity>

        <CustomButton
          isLoading={isLoading}
          title="Entrar"
          onPress={() => navigation.navigate('Home')}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
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
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Sizes.h1,
    color: Colors.white,
    alignSelf: 'center',
    marginBottom: 30,
  },
  forgotPassword: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.lightGray,
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 10,
  },
  registerText: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;