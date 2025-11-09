import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
import { API_URL } from '@env';


export const usePackages = () => {
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPackages = useCallback(async () => {
    if (!token) {
      // Não faz a requisição se não houver token
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/packages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível buscar os pacotes.');
      }

      return data; // Retorna os pacotes buscados

    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro de conexão.';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]); // A função é recriada se o token mudar

  // O hook retorna a função para buscar os dados e os estados de controle
  return { getPackages, isLoading, error };
};