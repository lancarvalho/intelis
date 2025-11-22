
import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { getPendingAffiliations, reviewAffiliation } from '../../services/api';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, User, FileText, MapPin, RefreshCw, Search } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [pending, setPending] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FormData | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getPendingAffiliations();
    setPending(data);
    setLoading(false);
  };

  const handleDecision = async (id: string, status: 'approved' | 'rejected') => {
      if (!confirm(`Tem certeza que deseja ${status === 'approved' ? 'APROVAR' : 'REJEITAR'} esta filiação?`)) return;
      
      setProcessing(true);
      const success = await reviewAffiliation(id, status);
      setProcessing(false);

      if (success) {
          setPending(prev => prev.filter(p => p.id !== id));
          setSelectedUser(null);
          alert(`Filiação ${status === 'approved' ? 'Aprovada' : 'Rejeitada'} com sucesso!`);
      }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-intelis-darkBlue flex items-center gap-2">
                <Search size={20}/> Auditoria de Filiações
            </h2>
            <p className="text-xs text-gray-500 mt-1">{pending.length} pendentes</p>
        </div>
        <div className="overflow-y-auto flex-1">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Carregando...</div>
            ) : pending.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Nenhuma pendência.</div>
            ) : (
                pending.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-100 border-l-4 border-l-intelis-blue' : ''}`}
                    >
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.cpf}</div>
                        <div className="text-xs text-gray-400 mt-1">{user.city} - {user.addressState}</div>
                    </div>
                ))
            )}
        </div>
        <div className="p-4 border-t border-gray-200">
            <Button onClick={loadData} variant="outline" className="w-full text-sm">
                <RefreshCw size={16} className="mr-2"/> Atualizar Lista
            </Button>
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 bg-gray-50 flex flex-col h-screen overflow-hidden">
         {selectedUser ? (
             <div className="flex-1 overflow-y-auto p-8">
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     {/* Header Details */}
                     <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                         <div>
                            <h1 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h1>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1"><User size={14}/> {selectedUser.cpf}</span>
                                <span className="flex items-center gap-1"><FileText size={14}/> Título: {selectedUser.voterTitle}</span>
                                <span className="flex items-center gap-1"><MapPin size={14}/> {selectedUser.city}-{selectedUser.addressState}</span>
                            </div>
                         </div>
                         <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide">
                             Pendente
                         </div>
                     </div>

                     {/* Biometry Check */}
                     <div className="p-6 grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                             <h4 className="font-semibold text-gray-700">Selfie (Biometria)</h4>
                             <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden border-2 border-gray-300 relative">
                                 {selectedUser.selfie ? (
                                     <img src={selectedUser.selfie} className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="flex items-center justify-center h-full text-gray-500">Sem foto</div>
                                 )}
                             </div>
                         </div>
                         <div className="space-y-2">
                             <h4 className="font-semibold text-gray-700">Documento (Frente)</h4>
                             <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                                 {/* In a real app, this would be the URL of the uploaded doc */}
                                 <span className="text-gray-500 text-sm text-center px-4">
                                     Visualização do documento indisponível no modo de demonstração
                                 </span>
                             </div>
                         </div>
                     </div>

                     {/* Data Grid */}
                     <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                         <h4 className="font-semibold text-gray-700 mb-4">Dados Cadastrais</h4>
                         <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                             <div>
                                 <span className="text-gray-500 block">Data de Nascimento</span>
                                 <span className="font-medium">{selectedUser.birthDate}</span>
                             </div>
                             <div>
                                 <span className="text-gray-500 block">Nome da Mãe</span>
                                 <span className="font-medium">{selectedUser.motherName}</span>
                             </div>
                             <div>
                                 <span className="text-gray-500 block">Email</span>
                                 <span className="font-medium">{selectedUser.email}</span>
                             </div>
                             <div>
                                 <span className="text-gray-500 block">Telefone</span>
                                 <span className="font-medium">{selectedUser.phone}</span>
                             </div>
                         </div>
                     </div>

                     {/* Actions */}
                     <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                         <Button 
                            variant="outline" 
                            onClick={() => handleDecision(selectedUser.id!, 'rejected')}
                            isLoading={processing}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                         >
                             <XCircle className="mr-2" size={18}/>
                             Rejeitar
                         </Button>
                         <Button 
                            onClick={() => handleDecision(selectedUser.id!, 'approved')}
                            isLoading={processing}
                            className="bg-green-600 hover:bg-green-700"
                         >
                             <CheckCircle className="mr-2" size={18}/>
                             Aprovar Filiação
                         </Button>
                     </div>
                 </div>
             </div>
         ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400">
                 Selecione um cadastro para auditar
             </div>
         )}
      </div>
    </div>
  );
};
