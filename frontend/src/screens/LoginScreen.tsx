import React, { useState } from 'react';
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

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '955704984969-0i17aighfaf4ka1okh7tvpihmi7tttoi.apps.googleusercontent.com', // Cole seu Web Client ID aqui
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      // A navegação será tratada pelo AuthProvider
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        'E-mail ou senha inválidos. Tente novamente.'
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
        Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
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
        <Text style={styles.title}>Bem-vindo ao Cade Meu Pacote</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

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

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <CustomButton title="Entrar" onPress={handleLogin} />
            <Text style={styles.dividerText}>ou</Text>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Icon name="google" size={24} color="#FFF" />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Cadastre-se</Text>
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
  logo: {
    width: 160,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
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