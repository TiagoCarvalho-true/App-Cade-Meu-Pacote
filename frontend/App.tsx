import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import RootNavigator from './src/navigation'; // 1. Importe o seu navegador

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Renderize o navegador em vez do texto de teste
  return <RootNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E', // Adicionei uma cor de fundo para a tela de loading
  },
});