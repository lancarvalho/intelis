import { FormData, INITIAL_DATA } from '../types';

export const fetchAddressByCEP = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    if (data.erro) return null;
    return data;
  } catch (error) {
    console.error("Error fetching CEP", error);
    return null;
  }
};

export const fetchStates = async () => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    return await response.json();
  } catch (error) {
    console.error("Error fetching states", error);
    return [];
  }
};

export const fetchCities = async (uf: string) => {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching cities", error);
    return [];
  }
};

// Mock backend for "Update" flow
export const fetchUserDataByCPF = async (cpf: string): Promise<FormData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate finding a user for a specific CPF
      if (cpf.replace(/\D/g, '') === '12345678900') {
        resolve({
          ...INITIAL_DATA,
          cpf: '123.456.789-00',
          fullName: 'João da Silva Intelis',
          email: 'joao@intelis.org.br',
          phone: '(61) 99999-8888',
          birthDate: '1990-01-01',
          termsAccepted: true,
          statuteAccepted: true,
          cep: '70000-000',
          addressState: 'DF',
          city: 'Brasília',
          street: 'Esplanada dos Ministérios',
          district: 'Zona Cívico-Administrativa',
          number: '100',
          // Pre-filling rest with dummy data
          motherName: 'Maria da Silva',
          profession: 'Cientista de Dados',
          electoralState: 'DF',
          electoralCity: 'Brasília',
          voterTitle: '123456789012'
        });
      } else {
        resolve(null);
      }
    }, 1500);
  });
};

export const simulateBiometricAuth = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      resolve(true);
    }, 2500);
  });
};

export const submitUpdateForReview = async (data: FormData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Data submitted for review:", data);
      resolve({
        success: true,
        message: "Dados validados com sucesso! Um e-mail de confirmação foi enviado para " + data.email
      });
    }, 2000);
  });
};