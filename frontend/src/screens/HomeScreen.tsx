import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { usePackages } from '../hooks/usePackages';
import PackageItem from '../components/PackageItem';
import CustomButton from '../components/CustomButton';
import AddPackageModal from '../components/addPackageModal';
import { Colors, Sizes } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const { packages, fetchPackages, loading, error } = usePackages();
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPackages = useCallback(async () => {
    setRefreshing(true);
    await fetchPackages();
    setRefreshing(false);
  }, [fetchPackages]);

  // useFocusEffect recarrega os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadPackages();
    }, [loadPackages])
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pacotes.');
    }
  }, [error]);

  const renderContent = () => {
    if (loading && !refreshing) {
      return <ActivityIndicator style={styles.centered} size="large" color={Colors.primary} />;
    }

    if (packages.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhum pacote encontrado.</Text>
          <Text style={styles.emptySubText}>Adicione um para começar a rastrear!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PackageItem packageData={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadPackages}
            tintColor={Colors.primary}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.name || 'Usuário'}</Text>
        <CustomButton title="Sair" onPress={signOut} style={{ paddingVertical: 8, paddingHorizontal: 12 }} textStyle={{ fontSize: 14 }} />
      </View>

      {renderContent()}

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Adicionar Pacote"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <AddPackageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPackageAdded={loadPackages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Sizes.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.padding,
  },
  title: {
    fontSize: Sizes.h2,
    color: Colors.white,
    fontFamily: 'Poppins_700Bold',
  },
  list: {
    paddingBottom: 80, // Espaço para o botão fixo
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Sizes.h3,
    color: Colors.white,
    fontFamily: 'Poppins_700Bold',
  },
  emptySubText: {
    fontSize: Sizes.body4,
    color: Colors.gray,
    fontFamily: 'Poppins_400Regular',
    marginTop: Sizes.base,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: Sizes.padding,
    right: Sizes.padding,
  },
});