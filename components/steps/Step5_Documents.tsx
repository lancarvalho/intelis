import React, { useRef, useState } from 'react';
import { FormData } from '../../types';
import { Upload, CheckCircle, Trash2 } from 'lucide-react';

interface Step5Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step5_Documents: React.FC<Step5Props> = ({ data, updateData }) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontPreview(reader.result as string);
          updateData({ docFront: file });
        } else {
          setBackPreview(reader.result as string);
          updateData({ docBack: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontPreview(null);
      updateData({ docFront: null });
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      setBackPreview(null);
      updateData({ docBack: null });
      if (backInputRef.current) backInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-intelis-darkBlue mb-2">Documentos</h2>
      <p className="text-gray-600 text-sm">
        Agora precisamos que você envie uma foto do seu documento de identificação (RG ou CNH).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Front */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] bg-gray-50 relative group hover:border-intelis-blue transition-colors">
          {frontPreview ? (
            <div className="relative w-full h-full flex items-center justify-center">
               <img src={frontPreview} alt="Frente" className="max-h-48 object-contain rounded shadow-md" />
               <button 
                onClick={() => clearFile('front')}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
               >
                 <Trash2 size={16} />
               </button>
               <div className="absolute bottom-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-[-10px] flex items-center">
                  <CheckCircle size={12} className="mr-1"/> Carregado
               </div>
            </div>
          ) : (
             <>
              <Upload className="text-gray-400 mb-4 group-hover:text-intelis-blue" size={48} />
              <p className="text-gray-500 font-medium mb-2 text-center">Frente do Documento</p>
              <button 
                onClick={() => frontInputRef.current?.click()}
                className="bg-white border border-intelis-blue text-intelis-blue px-4 py-2 rounded hover:bg-blue-50 text-sm"
              >
                Selecionar Arquivo
              </button>
             </>
          )}
          <input 
            type="file" 
            ref={frontInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'front')}
          />
        </div>

        {/* Back */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] bg-gray-50 relative group hover:border-intelis-blue transition-colors">
          {backPreview ? (
            <div className="relative w-full h-full flex items-center justify-center">
               <img src={backPreview} alt="Verso" className="max-h-48 object-contain rounded shadow-md" />
               <button 
                onClick={() => clearFile('back')}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
               >
                 <Trash2 size={16} />
               </button>
               <div className="absolute bottom-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-[-10px] flex items-center">
                  <CheckCircle size={12} className="mr-1"/> Carregado
               </div>
            </div>
          ) : (
             <>
              <Upload className="text-gray-400 mb-4 group-hover:text-intelis-blue" size={48} />
              <p className="text-gray-500 font-medium mb-2 text-center">Verso do Documento</p>
              <button 
                onClick={() => backInputRef.current?.click()}
                className="bg-white border border-intelis-blue text-intelis-blue px-4 py-2 rounded hover:bg-blue-50 text-sm"
              >
                Selecionar Arquivo
              </button>
             </>
          )}
          <input 
            type="file" 
            ref={backInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'back')}
          />
        </div>

      </div>
      <div className="flex justify-center mt-4">
          <div className="text-xs text-gray-500 max-w-md text-center">
            A imagem deve ser legível. Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
          </div>
      </div>
    </div>
  );
};
