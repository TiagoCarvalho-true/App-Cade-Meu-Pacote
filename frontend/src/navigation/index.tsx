import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { Colors } from '../constants/theme';

// --- 1. IMPORTAR O CONTEXTO E O LOADING ---
import { useAuthContext } from '../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Importe todas as suas telas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AllPackagesScreen from '../screens/AllPackagesScreen';
import PackageDetailsScreen from '../screens/PackageDetailsScreen';
import ConfigurationScreen from '../screens/ConfigurationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  dark: true,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.background,
    text: Colors.white,
    border: Colors.background,
    notification: Colors.primary,
  },
};

// --- 2. UMA TELA DE LOADING SIMPLES ---
// Esta tela será mostrada enquanto o AuthContext lê o AsyncStorage
const SplashScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const AppNavigator = () => {
  // --- 3. CONSUMIR O CONTEXTO ---
  const { user, isLoading } = useAuthContext();

  // --- 4. CHECAR O ESTADO DE LOADING DO CONTEXTO ---
  if (isLoading) {
    // Estamos verificando se o usuário está logado
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* --- 5. RENDERIZAÇÃO CONDICIONAL ---
          Se o 'user' existir, mostra o App. Senão, mostra a Autenticação.
        */}
        {user ? (
          // --- TELAS DO APP (USUÁRIO LOGADO) ---
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AllPackages" component={AllPackagesScreen} />
            <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
            <Stack.Screen name="Configuration" component={ConfigurationScreen} />
          </Stack.Group>
        ) : (
          // --- TELAS DE AUTH (USUÁRIO DESLOGADO) ---
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
               <Stack.Screen name="Register" component={RegisterScreen} />
            {/* Aqui também iria a tela de 'Esqueci minha senha' */}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// --- 6. ESTILOS PARA O SPLASHSCREEN ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

export default AppNavigator;