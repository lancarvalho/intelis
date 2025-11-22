import React from 'react';
import { FormData, Steps } from '../types';
import { Button } from './ui/Button';
import { User, MapPin, FileText, Heart, CreditCard, Camera, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

interface MemberPanelProps {
  data: FormData;
  onEditStep: (step: number) => void;
  onSubmitReview: () => void;
  isSubmitting: boolean;
}

export const MemberPanel: React.FC<MemberPanelProps> = ({ data, onEditStep, onSubmitReview, isSubmitting }) => {
  
  const SectionCard = ({ title, icon: Icon, step, children }: { title: string, icon: any, step: number, children?: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-intelis-blue">
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <button 
          onClick={() => onEditStep(step)}
          className="text-sm text-intelis-blue hover:bg-blue-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
        >
          <Edit2 size={14} />
          Editar
        </button>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-gradient-to-r from-intelis-blue to-intelis-darkBlue rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Olá, {data.fullName.split(' ')[0]}!</h1>
        <p className="text-blue-100 opacity-90">
          Este é o seu painel de filiado. Mantenha seus dados atualizados para garantir sua participação ativa no INTELIGENTES.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Status: <span className="font-semibold">Filiado Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SectionCard title="Dados Pessoais" icon={User} step={Steps.PERSONAL}>
          <p><span className="font-medium">CPF:</span> {data.cpf}</p>
          <p><span className="font-medium">Nascimento:</span> {data.birthDate}</p>
          <p><span className="font-medium">Email:</span> {data.email}</p>
          <p><span className="font-medium">Celular:</span> {data.phone}</p>
        </SectionCard>

        <SectionCard title="Endereço" icon={MapPin} step={Steps.ADDRESS}>
          <p>{data.street}, {data.number}</p>
          <p>{data.district}</p>
          <p>{data.city} - {data.addressState}</p>
          <p>{data.cep}</p>
        </SectionCard>

        <SectionCard title="Dados Eleitorais" icon={FileText} step={Steps.COMPLEMENTARY}>
          <p><span className="font-medium">Título:</span> {data.voterTitle}</p>
          <p><span className="font-medium">Zona Eleitoral:</span> {data.electoralCity}/{data.electoralState}</p>
          <p><span className="font-medium">Mãe:</span> {data.motherName}</p>
        </SectionCard>

        <SectionCard title="Interesses" icon={Heart} step={Steps.INTERESTS}>
          <p><span className="font-medium">Profissão:</span> {data.profession || 'Não informada'}</p>
          <p><span className="font-medium">Escolaridade:</span> {data.educationLevel || 'Não informada'}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {data.interests.length > 0 ? data.interests.map(i => (
              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">{i}</span>
            )) : <span className="text-gray-400 italic">Nenhum interesse selecionado</span>}
          </div>
        </SectionCard>

        <SectionCard title="Documentos" icon={CreditCard} step={Steps.DOCUMENTS}>
           <div className="flex items-center gap-2">
             {data.docFront ? <CheckCircle size={16} className="text-green-500"/> : <AlertCircle size={16} className="text-orange-500"/>}
             <span>Frente</span>
           </div>
           <div className="flex items-center gap-2">
             {data.docBack ? <CheckCircle size={16} className="text-green-500"/> : <AlertCircle size={16} className="text-orange-500"/>}
             <span>Verso</span>
           </div>
        </SectionCard>

        <SectionCard title="Biometria Facial" icon={Camera} step={Steps.SELFIE}>
          {data.selfie ? (
            <div className="flex items-center gap-2 text-green-600">
               <CheckCircle size={16} />
               <span>Foto cadastrada</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-500">
               <AlertCircle size={16} />
               <span>Pendente</span>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:p-6 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 hidden md:block">
            Após revisar todas as alterações, clique em enviar para processarmos sua atualização.
          </div>
          <Button 
            onClick={onSubmitReview} 
            isLoading={isSubmitting}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-lg px-8"
          >
            Enviar para Revisão
          </Button>
        </div>
      </div>
    </div>
  );
};