import React, { useState } from 'react';
import { FormData, ValidationErrors } from '../../types';
import { Input } from '../ui/Input';
import { formatCPF, formatPhone } from '../../utils/validators';
import { generateStatutePDF } from '../../services/pdfGenerator';
import { TermsModal } from '../ui/TermsModal';
import { Download } from 'lucide-react';

interface Step1Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  errors: ValidationErrors;
  isUpdating?: boolean;
}

export const Step1_Personal: React.FC<Step1Props> = ({ data, updateData, errors, isUpdating = false }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleAcceptTerms = () => {
    updateData({ termsAccepted: true });
    setIsTermsOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        onAccept={handleAcceptTerms}
      />

      <h2 className="text-2xl font-bold text-intelis-darkBlue mb-4">Dados Pessoais</h2>
      <p className="text-gray-600 text-sm mb-6">
        {isUpdating 
          ? "Atualize seus contatos. Dados de identificação (CPF, Nome, Nascimento) não podem ser alterados por aqui."
          : "Preencha seus dados básicos corretamente. Eles serão utilizados para validação junto ao TSE."
        }
      </p>

      <Input
        label="Nome Completo"
        value={data.fullName}
        onChange={(e) => updateData({ fullName: e.target.value })}
        placeholder="Digite seu nome completo"
        error={errors.fullName}
        required
        disabled={isUpdating}
      />

      <Input
        label="Data de Nascimento"
        type="date"
        value={data.birthDate}
        onChange={(e) => updateData({ birthDate: e.target.value })}
        error={errors.birthDate}
        required
        disabled={isUpdating}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="CPF"
          value={data.cpf}
          onChange={(e) => updateData({ cpf: formatCPF(e.target.value) })}
          placeholder="000.000.000-00"
          maxLength={14}
          error={errors.cpf}
          required
          disabled={isUpdating}
        />
        <Input
          label="Celular (WhatsApp)"
          value={data.phone}
          onChange={(e) => updateData({ phone: formatPhone(e.target.value) })}
          placeholder="(00) 00000-0000"
          maxLength={15}
          error={errors.phone}
          required
        />
      </div>

      <Input
        label="E-mail"
        type="email"
        value={data.email}
        onChange={(e) => updateData({ email: e.target.value })}
        placeholder="seu@email.com"
        error={errors.email}
        required
      />

      {!isUpdating && (
        <div className="mt-6 space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) => updateData({ termsAccepted: e.target.checked })}
              className="w-5 h-5 text-intelis-blue rounded border-gray-300 focus:ring-intelis-blue"
            />
            <span className="text-sm text-gray-700">
              Eu concordo com os <button type="button" onClick={() => setIsTermsOpen(true)} className="text-intelis-blue font-semibold hover:underline">TERMOS DE USO</button>
            </span>
          </label>
          {errors.termsAccepted && <p className="text-red-500 text-xs ml-8">{errors.termsAccepted}</p>}

          <div className="flex flex-col space-y-2">
             <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.statuteAccepted}
                  onChange={(e) => updateData({ statuteAccepted: e.target.checked })}
                  className="w-5 h-5 text-intelis-blue rounded border-gray-300 focus:ring-intelis-blue"
                />
                <span className="text-sm text-gray-700">
                  Eu concordo com o <span className="text-intelis-blue font-semibold">ESTATUTO DO PARTIDO</span>
                </span>
              </label>
              {errors.statuteAccepted && <p className="text-red-500 text-xs ml-8">{errors.statuteAccepted}</p>}
              
              <button 
                type="button"
                onClick={generateStatutePDF}
                className="ml-8 flex items-center text-xs font-medium text-intelis-green hover:text-green-700 transition-colors w-fit"
              >
                <Download size={14} className="mr-1" />
                CONHEÇA NOSSO ESTATUTO (BAIXAR PDF)
              </button>
          </div>
        </div>
      )}
    </div>
  );
};