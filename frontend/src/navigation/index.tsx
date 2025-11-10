import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { Colors } from '../constants/theme';

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

const AppNavigator = () => {
  // Removi a lógica condicional de autenticação para simplificar os testes
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login" // Começa na tela de Login
      >
        {/* Adicione todas as telas a um único navegador */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AllPackages" component={AllPackagesScreen} />
        <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
        <Stack.Screen name="Configuration" component={ConfigurationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;