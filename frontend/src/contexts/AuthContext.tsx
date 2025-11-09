import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para os dados do usuário que vamos armazenar no contexto
interface User {
  sub: string;
  email: string;
  name: string;
}

// Interface para o valor que o nosso contexto vai prover
interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean; // Para saber se estamos carregando o token do storage
  signIn(data: { user: User; access_token: string }): Promise<void>;
  signOut(): Promise<void>;
}

// Criamos o contexto com um valor padrão
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os dados do usuário ao iniciar o app
  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@CadeMeuPacote:token');
      const storedUser = await AsyncStorage.getItem('@CadeMeuPacote:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = async ({ user, access_token }: { user: User; access_token: string }) => {
    setUser(user);
    setToken(access_token);

    // Armazenamos os dados de forma persistente
    await AsyncStorage.setItem('@CadeMeuPacote:token', access_token);
    await AsyncStorage.setItem('@CadeMeuPacote:user', JSON.stringify(user));
  };

  const signOut = async () => {
    // Limpamos o storage e o estado
    await AsyncStorage.removeItem('@CadeMeuPacote:token');
    await AsyncStorage.removeItem('@CadeMeuPacote:user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useAuthContext(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}