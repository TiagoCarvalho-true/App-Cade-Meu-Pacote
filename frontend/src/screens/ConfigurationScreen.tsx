import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../hooks/useAuth';
import { usePackages } from '../hooks/usePackages';
import { ConfigurationScreenProps } from '../navigation/types';

export default function ConfigurationScreen({ navigation }: ConfigurationScreenProps) {
  const { user, signOut } = useAuth();
  const { packages } = usePackages();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const orderStats = useMemo(() => {
    return {
      total: packages.length,
      delivered: packages.filter((p) => p.status === 'delivered').length,
      inTransit: packages.filter((p) => p.status === 'in_transit').length,
      canceled: packages.filter((p) => p.status === 'canceled').length,
    };
  }, [packages]);

  const handleSignOut = () => {
    Alert.alert('Sair', 'Você tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  };

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
            <Text style={styles.avatarText}>{getInitials(user?.name || '??')}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico de Pedidos</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Total de Pedidos: {orderStats.total}</Text>
            <Text style={styles.statText}>Pedidos Entregues: {orderStats.delivered}</Text>
            <Text style={styles.statText}>Pedidos a caminho: {orderStats.inTransit}</Text>
            <Text style={styles.statText}>Pedidos Cancelados: {orderStats.canceled}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Sair da conta" onPress={handleSignOut} variant="danger" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  name: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h2,
  },
  email: {
    fontFamily: Fonts.regular,
    color: Colors.gray,
    fontSize: Sizes.body3,
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
    paddingBottom: 40,
  },
});