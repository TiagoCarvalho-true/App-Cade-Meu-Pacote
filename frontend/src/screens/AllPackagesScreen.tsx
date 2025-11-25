import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { Colors, Fonts, Sizes } from '../constants/theme';
import PackageItem from '../components/PackageItem';
import { AllPackagesScreenProps, Package } from '../navigation/types';
import { usePackages } from '../hooks/usePackages';
import { useAuth } from '../hooks/useAuth';

const statusColors: { [key: string]: string } = {
  delivered: Colors.green,
  in_transit: Colors.yellow,
  canceled: Colors.red,
  pending: Colors.gray,
};

export default function AllPackagesScreen({ navigation }: AllPackagesScreenProps) {
  const { packages, fetchPackages, loading } = usePackages();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPackages();
    setRefreshing(false);
  }, [fetchPackages]);

  useFocusEffect(
    useCallback(() => {
      fetchPackages();
    }, [fetchPackages])
  );

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const sections = useMemo(() => {
    const delivered = packages.filter((p) => p.status === 'delivered');
    const inTransit = packages.filter((p) => p.status === 'in_transit');
    const canceled = packages.filter((p) => p.status === 'canceled');

    const data = [];
    if (inTransit.length > 0) data.push({ title: 'Pacotes A caminho', data: inTransit });
    if (delivered.length > 0) data.push({ title: 'Pacotes Entregues', data: delivered });
    if (canceled.length > 0) data.push({ title: 'Pacotes Cancelados', data: canceled });

    return data;
  }, [packages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Pacotes</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name || '??')}</Text>
          </View>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('PackageDetails', { packageId: item.id })}>
                <PackageItem packageData={item} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.divider} />
              </>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum pacote encontrado.</Text>
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
            }
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h2,
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
  sectionTitle: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: Sizes.h3,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizes.height / 4,
  },
  emptyText: {
    color: Colors.gray,
    fontFamily: Fonts.regular,
    fontSize: Sizes.body3,
  },
});