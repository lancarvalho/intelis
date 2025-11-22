import React, { useState } from 'react';
import { FormData, ValidationErrors } from '../../types';
import { Input } from '../ui/Input';
import { formatCEP } from '../../utils/validators';
import { fetchAddressByCEP } from '../../services/api';
import { Loader2 } from 'lucide-react';

interface Step2Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  errors: ValidationErrors;
}

export const Step2_Address: React.FC<Step2Props> = ({ data, updateData, errors }) => {
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const handleCEPBlur = async () => {
    if (data.cep.length === 9) {
      setIsLoadingCEP(true);
      const address = await fetchAddressByCEP(data.cep);
      setIsLoadingCEP(false);
      
      if (address) {
        updateData({
          street: address.logradouro,
          district: address.bairro,
          city: address.localidade,
          addressState: address.uf
        });
      }
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-intelis-darkBlue mb-4">Endereço</h2>
      <p className="text-gray-600 text-sm mb-6">
        Informe seu endereço residencial atual.
      </p>

      <div className="relative">
        <Input
          label="CEP"
          value={data.cep}
          onChange={(e) => updateData({ cep: formatCEP(e.target.value) })}
          onBlur={handleCEPBlur}
          placeholder="00000-000"
          maxLength={9}
          error={errors.cep}
          required
        />
        {isLoadingCEP && (
          <div className="absolute right-3 top-9">
            <Loader2 className="animate-spin text-intelis-blue" size={20} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Estado (UF)"
          value={data.addressState}
          onChange={(e) => updateData({ addressState: e.target.value })}
          maxLength={2}
          className="uppercase"
          required
        />
        <div className="md:col-span-2">
           <Input
            label="Município"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Rua / Avenida"
            value={data.street}
            onChange={(e) => updateData({ street: e.target.value })}
            required
          />
        </div>
        <Input
          label="Bairro"
          value={data.district}
          onChange={(e) => updateData({ district: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Número"
          value={data.number}
          onChange={(e) => updateData({ number: e.target.value })}
          required
        />
        <div className="md:col-span-2">
          <Input
            label="Complemento"
            value={data.complement}
            onChange={(e) => updateData({ complement: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
