import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../hooks/useAuth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { AuthStackParamList } from '../navigation/types';
import { Colors, Sizes } from '../constants/theme';
import Logo from '../assets/images/logo.png';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '955704984969-0i17aighfaf4ka1okh7tvpihmi7tttoi.apps.googleusercontent.com', // Cole seu Web Client ID aqui
    });
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      Alert.alert('Sucesso!', 'Sua conta foi criada. Faça o login para continuar.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Erro no Cadastro',
        'Não foi possível criar a conta. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      if (idToken) {
        await signInWithGoogle(idToken);
      } else {
        throw new Error('Não foi possível obter o token do Google.');
      }
    } catch (error) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Erro', 'Não foi possível registrar com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>É rápido e fácil!</Text>

        <CustomInput
          iconName="account"
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
        />
        <CustomInput
          iconName="email"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          iconName="key"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomInput
          iconName="lock"
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <CustomButton title="Cadastrar" onPress={handleRegister} />
            <Text style={styles.dividerText}>ou</Text>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Icon name="google" size={24} color="#FFF" />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Sizes.padding,
  },
  title: {
    fontSize: Sizes.h1,
    fontFamily: 'Poppins_700Bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Sizes.base,
  },
  subtitle: {
    fontSize: Sizes.body3,
    fontFamily: 'Poppins_400Regular',
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Sizes.padding * 2,
  },
  logo: {
    width: 160,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Sizes.padding,
  },
  footerText: {
    color: Colors.gray,
    fontFamily: 'Poppins_400Regular',
  },
  link: {
    color: Colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  dividerText: {
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins_400Regular',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});