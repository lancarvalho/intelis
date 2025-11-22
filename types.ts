export interface FormData {
  // Step 1: Personal
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
  statuteAccepted: boolean;

  // Step 2: Address
  cep: string;
  addressState: string;
  city: string;
  street: string;
  district: string; // Bairro
  number: string;
  complement: string;

  // Step 3: Complementary
  voterTitle: string; // Título de Eleitor
  electoralState: string;
  electoralCity: string;
  gender: string;
  motherName: string;
  fatherName: string;
  
  // Candidatura fields
  isCandidate: boolean;
  politicalName: string;
  politicalOffice: string;
  electionYear: string;

  isVolunteer: boolean;
  isFiscal: boolean;

  // Step 4: Interests
  profession: string;
  educationLevel: string;
  religion: string;
  interests: string[];

  // Step 5: Documents
  docFront: File | null;
  docBack: File | null;

  // Step 6: Selfie
  selfie: string | null; // Base64 string
}

export const INITIAL_DATA: FormData = {
  fullName: '',
  birthDate: '',
  cpf: '',
  phone: '',
  email: '',
  termsAccepted: false,
  statuteAccepted: false,
  cep: '',
  addressState: '',
  city: '',
  street: '',
  district: '',
  number: '',
  complement: '',
  voterTitle: '',
  electoralState: '',
  electoralCity: '',
  gender: '',
  motherName: '',
  fatherName: '',
  isCandidate: false,
  politicalName: '',
  politicalOffice: '',
  electionYear: '',
  isVolunteer: false,
  isFiscal: false,
  profession: '',
  educationLevel: '',
  religion: '',
  interests: [],
  docFront: null,
  docBack: null,
  selfie: null,
};

export enum Steps {
  PERSONAL = 1,
  ADDRESS = 2,
  COMPLEMENTARY = 3,
  INTERESTS = 4,
  DOCUMENTS = 5,
  SELFIE = 6
}

export interface ValidationErrors {
  [key: string]: string;
}