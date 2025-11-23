
import React, { useEffect, useState } from 'react';
import { FormData, ValidationErrors } from '../../types';
import { Input } from '../ui/Input';
import { fetchStates, fetchCities } from '../../services/api';

interface Step3Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  errors: ValidationErrors;
  isUpdating?: boolean;
}

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

const POLITICAL_OFFICES = [
  "PREFEITO(A)",
  "VICE-PREFEITO(A)",
  "VEREADOR(A)",
  "DEPUTADO(A) ESTADUAL",
  "DEPUTADO(A) DISTRITAL",
  "DEPUTADO(A) FEDERAL",
  "SENADOR(A)",
  "SUPLENTE DE SENADOR(A)",
  "GOVERNADOR(A)",
  "VICE-GOVERNADOR(A)",
  "PRESIDENTE"
];

const MUNICIPAL_OFFICES = [
  "PREFEITO(A)",
  "VICE-PREFEITO(A)",
  "VEREADOR(A)"
];

export const Step3_Complementary: React.FC<Step3Props> = ({ data, updateData, errors, isUpdating = false }) => {
  const [states, setStates] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    fetchStates().then(setStates);
  }, []);

  useEffect(() => {
    if (data.electoralState) {
      setLoadingCities(true);
      fetchCities(data.electoralState).then((citiesData) => {
        setCities(citiesData);
        setLoadingCities(false);
      });
    } else {
      setCities([]);
    }
  }, [data.electoralState]);

  // Lógica de Ciclos Eleitorais rigorosa conforme solicitação
  const calculateElectionYears = (office: string): string[] => {
      if (!office) return [];

      const isMunicipal = MUNICIPAL_OFFICES.includes(office);
      
      // Definição dos anos-base iniciais
      // Municipal: 2024, Federal: 2026
      let baseYear = isMunicipal ? 2024 : 2026;
      
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // Avança o ano-base para o ciclo mais próximo (atual ou futuro)
      // Enquanto o ano-base for menor que o ano atual, soma 4
      // Ex: Em 2025, para municipal (base 2024): 2024 < 2025? Sim. Soma 4 = 2028.
      // Ex: Em 2025, para federal (base 2026): 2026 < 2025? Não. Mantém 2026.
      while (baseYear < currentYear) {
          baseYear += 4;
      }

      // Se o ano atual é menor que o ano-base calculado (ex: estamos em 2025, federal é 2026)
      // Então estamos antes da eleição, logo o ano-base é válido.
      if (currentYear < baseYear) {
          return [baseYear.toString()];
      }

      // Se estamos no ano da eleição (currentYear === baseYear)
      // Verificamos a data de corte: 15 de Agosto (mês 7, dia 15)
      const cutoffMonth = 7; // Agosto
      const cutoffDay = 15;

      const isAfterCutoff = 
          today.getMonth() > cutoffMonth || 
          (today.getMonth() === cutoffMonth && today.getDate() > cutoffDay);

      if (isAfterCutoff) {
          // A partir de 16/08 do ano da eleição, bloqueia o ano atual e libera os próximos 2 ciclos
          // Ex: Em 16/08/2024 (municipal), libera 2028 e 2032.
          return [(baseYear + 4).toString(), (baseYear + 8).toString()];
      } else {
          // Até 15/08 do ano da eleição, o ano atual ainda é a opção válida
          // Ex: Em 10/08/2024 (municipal), libera 2024.
          return [baseYear.toString()];
      }
  };

  // Atualiza os anos disponíveis quando o cargo muda
  useEffect(() => {
    if (data.isCandidate && data.politicalOffice) {
        const years = calculateElectionYears(data.politicalOffice);
        setAvailableYears(years);
        
        // Se houver apenas uma opção, seleciona automaticamente
        if (years.length === 1) {
            updateData({ electionYear: years[0] });
        } else if (data.electionYear && !years.includes(data.electionYear)) {
            // Se a opção atual não estiver na lista válida, reseta
            updateData({ electionYear: '' });
        }
    } else if (!data.isCandidate) {
        setAvailableYears([]);
        updateData({ electionYear: '' });
    }
  }, [data.politicalOffice, data.isCandidate]);


  const handleCandidateChange = (isCandidate: boolean) => {
    if (isCandidate) {
       updateData({ isCandidate: true });
    } else {
       updateData({ 
         isCandidate: false,
         politicalName: '',
         politicalOffice: '',
         electionYear: ''
       });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-intelis-darkBlue mb-4">Dados Complementares</h2>
      <p className="text-gray-600 text-sm mb-6">
        {isUpdating 
          ? "Mantenha seu local de votação atualizado. Título e Filiação são dados protegidos."
          : "Informações importantes para o TSE e estatísticas do partido."
        }
      </p>

      <div>
        <Input
            label="Título de Eleitor"
            value={data.voterTitle}
            onChange={(e) => updateData({ voterTitle: e.target.value.replace(/\D/g, '') })}
            placeholder="Digite apenas números"
            error={errors.voterTitle}
            required
            disabled={isUpdating}
        />
        <div className="-mt-3 mb-4 text-xs text-gray-500">
            Não sabe seu título? <a href="https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/" target="_blank" rel="noopener noreferrer" className="text-intelis-blue hover:underline font-medium">Podemos ajudar!</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Eleitoral <span className="text-red-500">*</span>
            </label>
            <select 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.electoralState 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-intelis-blue focus:border-intelis-blue'
                }`}
                value={data.electoralState}
                onChange={(e) => updateData({ electoralState: e.target.value, electoralCity: '' })}
            >
                <option value="">Selecione</option>
                {states.map(uf => (
                    <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                ))}
            </select>
            {errors.electoralState && <p className="mt-1 text-xs text-red-500">{errors.electoralState}</p>}
        </div>

        <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Município Eleitoral <span className="text-red-500">*</span>
            </label>
            <select 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.electoralCity 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-intelis-blue focus:border-intelis-blue'
                }`}
                value={data.electoralCity}
                onChange={(e) => updateData({ electoralCity: e.target.value })}
                disabled={!data.electoralState || loadingCities}
            >
                <option value="">{loadingCities ? 'Carregando...' : 'Selecione'}</option>
                {cities.map(city => (
                    <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
            </select>
            {errors.electoralCity && <p className="mt-1 text-xs text-red-500">{errors.electoralCity}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
        <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-intelis-blue bg-white"
            value={data.gender}
            onChange={(e) => updateData({ gender: e.target.value })}
        >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
        </select>
      </div>

      <Input
        label="Nome da Mãe"
        value={data.motherName}
        onChange={(e) => updateData({ motherName: e.target.value })}
        error={errors.motherName}
        required
        disabled={isUpdating}
      />
      
      <Input
        label="Nome do Pai"
        value={data.fatherName}
        onChange={(e) => updateData({ fatherName: e.target.value })}
        disabled={isUpdating}
      />

      <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-4 border border-blue-100">
        <h3 className="font-semibold text-intelis-blue text-lg">Participação Política</h3>
        
        <div className="flex flex-col space-y-4">
           <div className="flex items-center space-x-4">
                <span className="w-48 text-sm font-medium text-gray-700">Deseja ser candidato(a)?</span>
                <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="candidate" checked={data.isCandidate} onChange={() => handleCandidateChange(true)} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                    Sim
                </label>
                <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="candidate" checked={!data.isCandidate} onChange={() => handleCandidateChange(false)} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                    Não
                </label>
           </div>

           {data.isCandidate && (
             <div className="pl-4 border-l-2 border-intelis-blue mt-2 space-y-4 animate-fade-in bg-white p-4 rounded-r-lg shadow-sm">
                <Input
                    label="Nome Político / Nome de Urna"
                    value={data.politicalName}
                    onChange={(e) => updateData({ politicalName: e.target.value })}
                    placeholder="Ex: João do Povo"
                    error={errors.politicalName}
                    required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cargo Eletivo <span className="text-red-500">*</span>
                        </label>
                        <select 
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-white ${
                                errors.politicalOffice 
                                    ? 'border-red-500 focus:ring-red-200' 
                                    : 'border-gray-300 focus:ring-intelis-blue focus:border-intelis-blue'
                            }`}
                            value={data.politicalOffice}
                            onChange={(e) => updateData({ politicalOffice: e.target.value })}
                        >
                            <option value="">Selecione o Cargo</option>
                            {POLITICAL_OFFICES.map(office => (
                                <option key={office} value={office}>{office}</option>
                            ))}
                        </select>
                        {errors.politicalOffice && <p className="mt-1 text-xs text-red-500">{errors.politicalOffice}</p>}
                    </div>
                    
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ano da Eleição <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-intelis-blue bg-white disabled:bg-gray-100 disabled:text-gray-500"
                            value={data.electionYear}
                            onChange={(e) => updateData({ electionYear: e.target.value })}
                            disabled={!data.politicalOffice}
                        >
                            <option value="">{data.politicalOffice ? 'Selecione o Ano' : 'Selecione o Cargo primeiro'}</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
             </div>
           )}
        </div>

        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-2">Deseja ser um fiscal de urna?</span>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="fiscal" checked={data.isFiscal} onChange={() => updateData({ isFiscal: true })} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                        Sim
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="fiscal" checked={!data.isFiscal} onChange={() => updateData({ isFiscal: false })} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                        Não
                    </label>
                </div>
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-2">Deseja trabalhar como voluntário?</span>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="volunteer" checked={data.isVolunteer} onChange={() => updateData({ isVolunteer: true })} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                        Sim
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="volunteer" checked={!data.isVolunteer} onChange={() => updateData({ isVolunteer: false })} className="mr-2 w-4 h-4 text-intelis-blue focus:ring-intelis-blue" /> 
                        Não
                    </label>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
