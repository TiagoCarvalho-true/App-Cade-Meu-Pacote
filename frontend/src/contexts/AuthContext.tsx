import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

// Define a interface para o usuário e o contexto
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle(googleIdToken: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário e o token do armazenamento local ao iniciar o app
  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@App:user');
      const storagedToken = await AsyncStorage.getItem('@App:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        setToken(storagedToken);
        // Configura o token em todas as requisições do axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token: apiToken, user: apiUser } = response.data;

    setUser(apiUser);
    setToken(apiToken);

    // Configura o token para futuras requisições
    axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

    // Salva os dados no armazenamento local
    await AsyncStorage.setItem('@App:user', JSON.stringify(apiUser));
    await AsyncStorage.setItem('@App:token', apiToken);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // A rota de criação de usuário geralmente não retorna o token direto
    // O usuário precisará fazer login após o cadastro
    await axios.post(`${API_URL}/users`, {
      name,
      email,
      password,
    });
  };
  const signInWithGoogle = async (googleIdToken: string) => {
    const response = await axios.post(`${API_URL}/auth/google`, {
      token: googleIdToken,
    });

    const { token: apiToken, user: apiUser } = response.data;

    setUser(apiUser);
    setToken(apiToken);

    axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

    await AsyncStorage.setItem('@App:user', JSON.stringify(apiUser));
    await AsyncStorage.setItem('@App:token', apiToken);
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;