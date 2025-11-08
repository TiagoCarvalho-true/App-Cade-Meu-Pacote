import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, SectionList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Sizes } from '../constants/theme';
import PackageItem from '../components/PackageItem';
import { AllPackagesScreenProps } from '../navigation/types';

const mockData = [
  {
    title: 'Pacotes Entregues',
    status: 'delivered',
    data: [
      { id: '1', name: 'Goku Super Sayajin 4', type: 'Action figure', storeIcon: require('../assets/images/amazon_logo.png') },
      { id: '2', name: 'Sandália Havaina', type: 'Calçados', storeIcon: require('../assets/images/aliexpress_logo.png') },
    ],
  },
  {
    title: 'Pacotes A caminho',
    status: 'in_transit',
    data: [
      { id: '3', name: 'Goku Super Sayajin 4', type: 'Action figure', storeIcon: require('../assets/images/amazon_logo.png') },
      { id: '4', name: 'Sandália Havaina', type: 'Calçados', storeIcon: require('../assets/images/aliexpress_logo.png') },
    ],
  },
  {
    title: 'Pacotes Cancelados',
    status: 'canceled',
    data: [
      { id: '5', name: 'Goku Super Sayajin 4', type: 'Action figure', storeIcon: require('../assets/images/amazon_logo.png') },
      { id: '6', name: 'Sandália Havaina', type: 'Calçados', storeIcon: require('../assets/images/aliexpress_logo.png') },
    ],
  },
];

const statusColors: { [key: string]: string } = {
  delivered: Colors.green,
  in_transit: Colors.yellow,
  canceled: Colors.red,
};

const AllPackagesScreen = ({ navigation }: AllPackagesScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BM</Text>
          </View>
        </View>

        <SectionList
          sections={mockData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => (
            <TouchableOpacity onPress={() => navigation.navigate('PackageDetails', { packageId: item.id })}>
              <PackageItem
                title={item.name}
                subtitle={item.type}
                storeIcon={item.storeIcon}
                onPressInfo={() => navigation.navigate('PackageDetails', { packageId: item.id })}
                containerStyle={{ backgroundColor: statusColors[section.status] }}
              />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <>
              <Text style={styles.sectionTitle}>{title}</Text>
              <View style={styles.divider} />
            </>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    fontSize: Sizes.h2,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 15,
  },
});

export default AllPackagesScreen;