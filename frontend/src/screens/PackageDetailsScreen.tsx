import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Sizes } from '../constants/theme';
import Timeline from '../components/Timeline';
import { PackageDetailsScreenProps } from '../navigation/types';

const trackingData = {
  item: {
    title: 'Goku Super Sayajin 4',
    subtitle: 'Action figure',
    storeIcon: require('../assets/images/amazon_logo.png'),
  },
  events: [
    {
      location: 'Agência dos Correios,\nSão Paulo - SP',
      timestamp: '02/10/2025 11:45',
      status: 'Objeto postado',
      color: '#007AFF',
    },
    {
      location: 'Unidade de Tratamento,\nCuritiba - PR',
      timestamp: '04/10/2025 15:12',
      status: 'Objeto em trânsito - por favor aguarde',
      color: ['#007AFF', Colors.primary],
    },
    {
      location: 'Unidade de Distribuição,\nManaus - AM',
      timestamp: '06/10/2025 08:30',
      status: 'Objeto saiu para entrega ao destinatário',
      color: Colors.primary,
    },
  ],
};

const PackageDetailsScreen = ({ navigation }: PackageDetailsScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BM</Text>
          </View>
        </View>

        <View style={styles.packageSummary}>
          <Image source={trackingData.item.storeIcon} style={styles.storeIcon} />
          <View>
            <Text style={styles.packageTitle}>{trackingData.item.title}</Text>
            <Text style={styles.packageSubtitle}>{trackingData.item.subtitle}</Text>
          </View>
        </View>

        <Timeline events={trackingData.events} />
      </View>
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
    borderRadius: Sizes.base,
    marginRight: 15,
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

export default PackageDetailsScreen;