import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { ConfigurationScreenProps } from '../navigation/types';

// Mock de dados do usuário. Substitua pela sua lógica de autenticação (context, store, etc.)
const user = {
  name: 'Bruno Marinho',
  email: 'brunomarinho@gmail.com',
};

const orderStats = {
  total: 6,
  delivered: 2,
  inTransit: 2,
  canceled: 2,
};

const ConfigurationScreen = ({ navigation }: ConfigurationScreenProps) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico de Pedidos</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Total de Pedidos: {orderStats.total} Pedidos</Text>
            <Text style={styles.statText}>Pedidos Entregues: {orderStats.delivered} Pedidos</Text>
            <Text style={styles.statText}>Pedidos a caminho: {orderStats.inTransit} Pedidos</Text>
            <Text style={styles.statText}>Pedidos Cancelados: {orderStats.canceled} Pedidos</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Trocar de Conta" onPress={() => { /* Lógica para trocar de conta */ }} />
          <CustomButton title="Sair da conta" onPress={() => { /* Lógica para sair */ }} />
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.lightGray, // Cor do círculo do avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: Colors.primary, // Cor do texto dentro do avatar
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  name: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h3,
  },
  email: {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: Sizes.h2,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  historySection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: Sizes.h2,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    gap: 12,
  },
  statText: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h3,
  },
  buttonContainer: {
    gap: 15,
  },
});

export default ConfigurationScreen;