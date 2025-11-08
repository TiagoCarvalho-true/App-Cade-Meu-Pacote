import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

interface AddPackageModalProps {
  visible: boolean;
  onClose: () => void;
}

const productTypes = [
  'Moda', 'Calçados', 'Higiene', 'Acessórios', 'Eletrônicos',
  'Informática', 'Celulares', 'Móveis', 'Esporte'
];

const AddPackageModal: React.FC<AddPackageModalProps> = ({ visible, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

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
            />
            <CustomInput
              iconName="barcode-scan"
              iconColor={Colors.primary}
              placeholder="Código do Produto"
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

            <CustomButton title="Criar Pedido" onPress={() => { onClose(); }} />

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