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

  // Função de login com Email/Senha (seu código original)
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

      await signIn(data);
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Registro (seu código original)
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
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

  // --- NOVO MÉTODO ---
  /**
   * Lida com o login via Google.
   * Recebe o idToken do Google (vinda do expo-auth-session) e o envia
   * para o nosso backend no endpoint /auth/google.
   */
  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    if (!idToken) {
      Alert.alert('Atenção', 'Token do Google não encontrado.');
      return false;
    }

    setIsLoading(true); // Ativa o loading global
    try {
      // 1. Chama o endpoint do backend que criamos
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // O backend espera um objeto com a chave "token"
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível fazer login com o Google.');
      }

      // 2. Se o backend deu 200/201, ele nos deu nosso
      //    próprio access_token. Usamos o signIn do contexto!
      await signIn(data);

      return true;
    } catch (error: any) {
      Alert.alert('Erro no Login Google', error.message);
      return false;
    } finally {
      setIsLoading(false); // Desliga o loading global
    }
  };

  // Atualiza o retorno do hook para incluir a nova função
  return { login, register, loginWithGoogle, isLoading };
};