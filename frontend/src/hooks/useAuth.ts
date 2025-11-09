import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
import { API_URL } from '@env';


export interface AuthData {
  access_token: string;
  user: {
    sub: string;
    email: string;
    name: string;
  };
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext(); // Pegamos a função signIn do contexto

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha o email e a senha.');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email ou senha inválidos.');
      }

      // Usamos a função do contexto para salvar os dados globalmente
      await signIn(data);

      return true;
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, { // Usando o endpoint POST /users
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // O backend retorna um ConflictException (409) se o email já existir
        throw new Error(data.message || 'Não foi possível realizar o cadastro.');
      }

      Alert.alert('Sucesso!', 'Cadastro realizado. Agora você pode fazer o login.');
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading };
};