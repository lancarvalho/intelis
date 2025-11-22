import React from 'react';
import { FormData } from '../../types';
import { Input } from '../ui/Input';
import { Briefcase, GraduationCap, Users, Shield, Lightbulb, BookOpen } from 'lucide-react';
import { getReligions, getSchoolingLevels, getCommonProfessions } from '../../services/api';

interface Step4Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step4_Interests: React.FC<Step4Props> = ({ data, updateData }) => {
  const schoolingLevels = getSchoolingLevels();
  const religions = getReligions();
  const professions = getCommonProfessions();

  const interestOptions = [
    { id: 'mulher', label: 'MULHER', icon: Users, color: 'text-pink-500' },
    { id: 'juventude', label: 'JUVENTUDE', icon: Users, color: 'text-cyan-500' },
    { id: 'empreendedorismo', label: 'EMPREENDEDORISMO', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'seguranca', label: 'SEGURANÇA', icon: Shield, color: 'text-blue-600' },
    { id: 'educacao', label: 'EDUCAÇÃO', icon: BookOpen, color: 'text-purple-500' },
  ];

  const toggleInterest = (id: string) => {
    const current = data.interests;
    if (current.includes(id)) {
      updateData({ interests: current.filter(i => i !== id) });
    } else {
      updateData({ interests: [...current, id] });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-intelis-darkBlue">Dados Sociais e Interesses</h2>
          <button className="text-sm text-intelis-blue hover:underline">Pular etapa</button>
       </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
        <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-gray-400" size={18}/>
            <select 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-intelis-blue bg-white"
                value={data.profession}
                onChange={(e) => updateData({ profession: e.target.value })}
            >
                <option value="">Selecione sua profissão</option>
                {professions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
          <div className="relative">
             <GraduationCap className="absolute left-3 top-3 text-gray-400" size={18}/>
            <select 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-intelis-blue bg-white"
                value={data.educationLevel}
                onChange={(e) => updateData({ educationLevel: e.target.value })}
            >
                <option value="">Selecione</option>
                {schoolingLevels.map((level) => (
                    <option key={level.id} value={level.id}>{level.label}</option>
                ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Religião</label>
          <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-intelis-blue bg-white"
                value={data.religion}
                onChange={(e) => updateData({ religion: e.target.value })}
            >
                <option value="">Selecione</option>
                {religions.map((rel) => (
                    <option key={rel.id} value={rel.id}>{rel.label}</option>
                ))}
            </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Selecione suas áreas de interesse</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {interestOptions.map((opt) => {
          const isSelected = data.interests.includes(opt.id);
          const Icon = opt.icon;
          return (
            <div 
              key={opt.id}
              onClick={() => toggleInterest(opt.id)}
              className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md ${
                isSelected ? 'border-intelis-blue bg-blue-50 ring-2 ring-intelis-blue ring-opacity-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 ${opt.color}`}>
                 <Icon size={20} />
              </div>
              <span className={`font-bold text-xs text-center ${isSelected ? 'text-intelis-blue' : 'text-gray-500'}`}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};