
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

// Listas estáticas baseadas na análise do sistema de referência
export const getSchoolingLevels = () => [
  { id: 'analis', label: 'Analfabeto' },
  { id: 'fund_inc', label: 'Ensino Fundamental Incompleto' },
  { id: 'fund_comp', label: 'Ensino Fundamental Completo' },
  { id: 'med_inc', label: 'Ensino Médio Incompleto' },
  { id: 'med_comp', label: 'Ensino Médio Completo' },
  { id: 'sup_inc', label: 'Ensino Superior Incompleto' },
  { id: 'sup_comp', label: 'Ensino Superior Completo' },
  { id: 'pos', label: 'Pós-graduação / Mestrado / Doutorado' }
];

export const getReligions = () => [
  { id: 'catolica', label: 'Católica' },
  { id: 'evangelica', label: 'Evangélica' },
  { id: 'espirita', label: 'Espírita' },
  { id: 'matriz_africana', label: 'Matriz Africana' },
  { id: 'judaismo', label: 'Judaísmo' },
  { id: 'islamismo', label: 'Islamismo' },
  { id: 'budismo', label: 'Budismo' },
  { id: 'outra', label: 'Outra' },
  { id: 'sem_religiao', label: 'Sem Religião' }
];

export const getCommonProfessions = () => [
  "Administrador(a)", "Advogado(a)", "Agricultor(a)", "Arquiteto(a)", "Artista", 
  "Assistente Social", "Atleta", "Autônomo(a)", "Bancário(a)", "Comerciante", 
  "Contador(a)", "Dentista", "Do Lar", "Economista", "Enfermeiro(a)", 
  "Engenheiro(a)", "Estudante", "Empresário(a)", "Farmacêutico(a)", 
  "Funcionário(a) Público(a)", "Jornalista", "Médico(a)", "Motorista", 
  "Policial", "Professor(a)", "Psicólogo(a)", "Vendedor(a)", "Veterinário(a)", "Outros"
];

// Mock backend for "Update" flow
export const fetchUserDataByCPF = async (cpf: string): Promise<FormData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate finding a user for a specific CPF (both cleaned and formatted)
      const cleanedCpf = cpf.replace(/\D/g, '');
      
      if (cleanedCpf === '12345678900') {
        resolve({
          ...INITIAL_DATA,
          id: 'usr_123',
          status: 'approved',
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
          profession: 'Administrador(a)',
          educationLevel: 'sup_comp',
          religion: 'catolica',
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

export const sendWelcomeEmail = async (data: FormData) => {
  console.log("--- SIMULANDO ENVIO DE E-MAIL ---");
  console.log(`Para: ${data.email}`);
  console.log(`Assunto: Bem-vindo ao INTELIGENTES - Sua Ficha de Filiação`);
  console.log(`Corpo: Olá ${data.fullName}, obrigado por se filiar! Em anexo está sua ficha de filiação.`);
  console.log("--- FIM DA SIMULAÇÃO ---");
};

// Mock Admin API
export const getPendingAffiliations = async (): Promise<FormData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          ...INITIAL_DATA,
          id: 'pend_1',
          status: 'pending',
          fullName: 'Ana Souza',
          cpf: '987.654.321-00',
          email: 'ana.souza@email.com',
          phone: '(11) 98888-7777',
          birthDate: '1995-05-12',
          city: 'São Paulo',
          addressState: 'SP',
          motherName: 'Clara Souza',
          voterTitle: '123412341234',
          selfie: 'https://randomuser.me/api/portraits/women/44.jpg', // Mock Image
          // Mock Docs (usually these are URLs from bucket)
          docFront: new File([""], "frente.jpg"), 
          docBack: new File([""], "verso.jpg")
        },
        {
          ...INITIAL_DATA,
          id: 'pend_2',
          status: 'pending',
          fullName: 'Carlos Pereira',
          cpf: '456.789.123-00',
          email: 'carlos.p@email.com',
          phone: '(21) 97777-6666',
          birthDate: '1988-11-23',
          city: 'Rio de Janeiro',
          addressState: 'RJ',
          motherName: 'Joana Pereira',
          voterTitle: '432143214321',
          selfie: 'https://randomuser.me/api/portraits/men/32.jpg',
          docFront: new File([""], "frente.jpg"), 
          docBack: new File([""], "verso.jpg")
        }
      ]);
    }, 1000);
  });
};

export const reviewAffiliation = async (id: string, status: 'approved' | 'rejected', reason?: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Affiliation ${id} ${status}. Reason: ${reason}`);
            resolve(true);
        }, 1000);
    });
};
