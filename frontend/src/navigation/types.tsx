import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AllPackages: undefined;
  PackageDetails: { packageId: string };
  Configuration: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type AllPackagesScreenProps = NativeStackScreenProps<RootStackParamList, 'AllPackages'>;
export type PackageDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'PackageDetails'>;
export type ConfigurationScreenProps = NativeStackScreenProps<RootStackParamList, 'Configuration'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;