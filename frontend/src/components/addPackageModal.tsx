import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { usePackages } from '../hooks/usePackages';

interface AddPackageModalProps {
  visible: boolean;
  onClose: () => void;
  onPackageAdded?: () => void;
}

const productTypes = [
  'Moda', 'Calçados', 'Higiene', 'Acessórios', 'Eletrônicos',
  'Informática', 'Celulares', 'Móveis', 'Esporte'
];

const AddPackageModal: React.FC<AddPackageModalProps> = ({ visible, onClose, onPackageAdded }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const { createPackage, isLoading } = usePackages();

  const handleCreate = async () => {
    if (!name || !trackingCode) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const result = await createPackage(name, trackingCode);
    if (result) {
      Alert.alert('Sucesso', 'Pacote adicionado com sucesso!');
      setName('');
      setTrackingCode('');
      setSelectedType(null);
      if (onPackageAdded) onPackageAdded();
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomInput
              iconName="cube-outline"
              iconColor={Colors.primary}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <CustomInput
              iconName="barcode-scan"
              iconColor={Colors.primary}
              placeholder="Código do Produto"
              value={trackingCode}
              onChangeText={setTrackingCode}
            />

            <Text style={styles.sectionTitle}>Tipo de Produto</Text>
            <View style={styles.typesContainer}>
              {productTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    selectedType === type && { backgroundColor: Colors.primary }
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.typeChipText,
                    selectedType === type && { color: Colors.white, fontFamily: Fonts.bold }
                  ]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.darkRedButton}>
              <Text style={styles.darkRedButtonText}>Inserir Mais</Text>
            </TouchableOpacity>

            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <CustomButton title="Criar Pedido" onPress={handleCreate} />
            )}

            <TouchableOpacity style={styles.redButton} onPress={onClose}>
              <Text style={styles.redButtonText}>Sair</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.background,
    textAlign: 'center',
    marginVertical: 15,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeChip: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  typeChipText: {
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },
  darkRedButton: {
    backgroundColor: Colors.darkRed,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  darkRedButtonText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  redButton: {
    backgroundColor: Colors.red,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  redButtonText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
});

export default AddPackageModal;