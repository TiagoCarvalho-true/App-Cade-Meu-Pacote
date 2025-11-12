import React, { useState, useEffect } from 'react'; // <-- NOVO (useEffect)
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert, // <-- NOVO
} from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { LoginScreenProps } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';

// --- NOVO: Imports do Google ---
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
// ------------------------------

// NOVO: Permite que o login abra no navegador do celular (WebView)
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  // --- Estados do formulário de email ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // isLoadingEmail vem do seu hook, renomeei para clareza
  const { login, isLoading: isLoadingEmail } = useAuth();

  // --- NOVO: Estado e Lógica do Google ---
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Vamos assumir que o useAuth vai nos dar a nova função
  // (Vamos ter que adicionar isso ao hook useAuth depois)
  const { loginWithGoogle } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Use os IDs do Google Cloud Console
    expoClientId: 'SEU_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'SEU_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'SEU_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com',
  });

  // Observa a resposta do Google
  useEffect(() => {
    setIsLoadingGoogle(true);
    if (response?.type === 'success') {
      const { id_token } = response.params;

      // Envia o token para o nosso hook de autenticação
      // que por sua vez o enviará ao nosso backend
      if (id_token) {
        handleGoogleLogin(id_token);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Login Falhou', 'Não foi possível conectar ao Google.');
      setIsLoadingGoogle(false);
    } else {
      // Se o usuário fechar a janela do Google (response.type === 'dismiss')
      setIsLoadingGoogle(false);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    // A lógica de API fica toda dentro do hook,
    // a tela só chama a função
    await loginWithGoogle(idToken);

    // O isLoadingGoogle será desligado pelo próprio hook
    // (quando a promessa for resolvida, com sucesso ou falha)
    // Mas, por segurança, podemos desligar aqui caso o hook não o faça.
    setIsLoadingGoogle(false);
  };
  // --- Fim da Lógica do Google ---


  // --- Lógica do Login com Email ---
  const handleEmailLogin = async () => {
    await login(email, password);
    // A navegação é tratada pelo AppNavigator (que ouve o AuthContext)
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

        {/* --- Formulário de Email/Senha --- */}
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
          isLoading={isLoadingEmail}
          title="Entrar"
          onPress={handleEmailLogin}
        />

        {/* --- NOVO: Divisor "OU" --- */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* --- NOVO: Botão de Login do Google --- */}
        <CustomButton
          title="Entrar com Google"
          isLoading={isLoadingGoogle}
          disabled={!request}
          onPress={() => {
            promptAsync(); // Inicia o fluxo do Google
          }}
          // Podemos criar um estilo secundário para este botão
          style={styles.googleButton}
          textStyle={styles.googleButtonText}
          iconName="google" // Assumindo que seu CustomButton aceita um ícone
        />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- NOVO: Estilos Adicionados ---
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

  // --- NOVOS ESTILOS PARA O LOGIN SOCIAL ---
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray,
  },
  dividerText: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: Colors.white, // Fundo branco
  },
  googleButtonText: {
    color: Colors.black, // Texto preto
  },
});

export default LoginScreen;