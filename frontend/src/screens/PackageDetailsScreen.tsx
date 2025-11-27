import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Colors, Sizes, Fonts } from '../constants/theme';
import Timeline from '../components/Timeline';
import { usePackages } from '../hooks/usePackages';
import { useAuth } from '../hooks/useAuth';
// import { Package } from '../navigation/types';

export default function PackageDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { getPackageById, loading } = usePackages();
  const { user } = useAuth();

  const [packageDetails, setPackageDetails] = useState<Package | null>(null);
  const { packageId } = route.params as { packageId: string };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const loadPackageDetails = useCallback(async () => {
    try {
      const data = await getPackageById(packageId);
      setPackageDetails(data);
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar os detalhes do pacote.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [packageId, getPackageById, navigation]);

  useEffect(() => {
    loadPackageDetails();
  }, [loadPackageDetails]);

  if (loading || !packageDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name || '??')}</Text>
          </View>
        </View>

        <View style={styles.packageSummary}>
          <Image
            source={{ uri: packageDetails.storeIconUrl || 'https://via.placeholder.com/50' }}
            style={styles.storeIcon}
          />
          <View>
            <Text style={styles.packageTitle}>{packageDetails.name || 'Nome do Pacote'}</Text>
            <Text style={styles.packageSubtitle}>{packageDetails.trackingCode}</Text>
          </View>
        </View>

        <Timeline events={packageDetails.timeline || []} />
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
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
  packageSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginBottom: 30,
  },
  storeIcon: {
    width: 50,
    height: 50,
    borderRadius: Sizes.radius,
    marginRight: 15,
    backgroundColor: Colors.lightGray,
  },
  packageTitle: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: 18,
  },
  packageSubtitle: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    fontSize: 14,
  },
});