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

export const Step3_Complementary: React.FC<Step3Props> = ({ data, updateData, errors, isUpdating = false }) => {
  const [states, setStates] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

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

      <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-4">
        <h3 className="font-semibold text-intelis-blue">Deseja participar mais ativamente?</h3>
        
        <div className="flex items-center space-x-4">
           <span className="w-48 text-sm text-gray-700">Deseja ser candidato(a)?</span>
           <label className="inline-flex items-center">
             <input type="radio" name="candidate" checked={data.isCandidate} onChange={() => updateData({ isCandidate: true })} className="mr-1" /> Sim
           </label>
           <label className="inline-flex items-center">
             <input type="radio" name="candidate" checked={!data.isCandidate} onChange={() => updateData({ isCandidate: false })} className="mr-1" /> Não
           </label>
        </div>

        <div className="flex items-center space-x-4">
           <span className="w-48 text-sm text-gray-700">Deseja ser voluntário?</span>
           <label className="inline-flex items-center">
             <input type="radio" name="volunteer" checked={data.isVolunteer} onChange={() => updateData({ isVolunteer: true })} className="mr-1" /> Sim
           </label>
           <label className="inline-flex items-center">
             <input type="radio" name="volunteer" checked={!data.isVolunteer} onChange={() => updateData({ isVolunteer: false })} className="mr-1" /> Não
           </label>
        </div>
      </div>
    </div>
  );
};