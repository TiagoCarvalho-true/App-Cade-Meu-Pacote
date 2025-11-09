import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Sizes } from '../constants/theme';
import PackageItem from '../components/PackageItem';
import AddPackageModal from '../components/addPackageModal';
import { HomeScreenProps } from '../navigation/types';
import { useAuthContext } from '../contexts/AuthContext';
import { usePackages } from '../hooks/usePackages';

// Mantemos os dados mocados para visualização, como solicitado.
const mockPackages = [
  {
    id: '1',
    title: 'Goku Super Sayajin 4',
    subtitle: 'Action figure',
    storeIcon: require('../assets/images/amazon_logo.png'),
  },
  {
    id: '2',
    title: 'Sandália Havaina',
    subtitle: 'Calçados',
    storeIcon: require('../assets/images/aliexpress_logo.png'),
  },
];

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [packages, setPackages] = useState([]); // 1. Estado para os pacotes da API
  const { user } = useAuthContext(); // 1. Pegamos os dados do usuário do contexto.
  const { getPackages, isLoading } = usePackages(); // 2. Usamos nosso hook de pacotes.

  useEffect(() => {
    const fetchPackages = async () => {
      const dataFromApi = await getPackages();

      if (dataFromApi) {
        // 2. Atualizamos o estado com os dados recebidos da API
        setPackages(dataFromApi);
      }
    };

    fetchPackages();
  }, [getPackages]); // O useEffect será executado quando o componente montar.

  // Função para pegar as iniciais do nome do usuário.
  const getInitials = (name: string | undefined) =>
    name
      ?.split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="map-marker-outline" size={32} color={Colors.primary} />
          <View style={styles.avatar}>
            {/* 3. Usamos as iniciais do usuário logado. */}
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
        </View>

        <Text style={styles.title}>Pacotes</Text>
        <View style={styles.divider} />

        {/* 4. Mostramos um indicador de carregamento enquanto a busca acontece em segundo plano. */}
        {isLoading && <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />}

        {!isLoading && (
          <FlatList
            data={packages} // 3. Usamos o estado 'packages' em vez dos dados mocados
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('PackageDetails', { packageId: item.id })}>
                <PackageItem
                  title={item.title}
                  subtitle={item.subtitle}
                  storeIcon={item.storeIcon}
                  onPressInfo={() => navigation.navigate('PackageDetails', { packageId: item.id })}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AllPackages')}>
          <Icon name="cube-outline" size={28} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, { marginTop: 15 }]} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <AddPackageModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h1,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 15,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;