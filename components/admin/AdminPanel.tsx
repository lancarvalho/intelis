
import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { getPendingAffiliations, reviewAffiliation } from '../../services/api';
import { Button } from '../ui/Button';
import { AdminLogin } from './AdminLogin';
import { CheckCircle, XCircle, User, FileText, MapPin, RefreshCw, Search, LogOut, ExternalLink } from 'lucide-react';

export const AdminPanel: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pending, setPending] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FormData | null>(null);
  const [processing, setProcessing] = useState(false);

  // Verificar sessão ativa ao montar
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('intelis_admin_auth');
    if (sessionAuth === 'true') {
        setIsAuthenticated(true);
    }
  }, []);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
        loadData();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
      sessionStorage.setItem('intelis_admin_auth', 'true');
      setIsAuthenticated(true);
  };

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

  const handleLogout = () => {
      sessionStorage.removeItem('intelis_admin_auth');
      setIsAuthenticated(false);
      onExit();
  };

  const handleGoToSite = () => {
      // Não remove a sessão, apenas volta para a home
      onExit();
  };

  if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={onExit} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-intelis-darkBlue text-white flex justify-between items-center shadow-md z-10">
            <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Search size={20}/> Auditoria
                </h2>
                <p className="text-xs text-blue-200 mt-1">{pending.length} pendentes</p>
            </div>
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-transparent hover:border-red-400" 
                title="Sair do sistema"
            >
                SAIR <LogOut size={14} />
            </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
            {loading ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-intelis-blue" size={24} />
                    Carregando...
                </div>
            ) : pending.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                    <CheckCircle size={48} className="text-gray-300 mb-2" />
                    <p>Nenhuma pendência.</p>
                    <p className="text-xs">Tudo em dia por aqui!</p>
                </div>
            ) : (
                pending.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors group ${selectedUser?.id === user.id ? 'bg-blue-100 border-l-4 border-l-intelis-blue' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="font-medium text-gray-900 group-hover:text-intelis-blue transition-colors">{user.fullName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                             <User size={12} /> {user.cpf}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                             <MapPin size={12} /> {user.city} - {user.addressState}
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
            <Button onClick={loadData} variant="primary" className="w-full text-sm shadow-sm">
                <RefreshCw size={16} className="mr-2"/> Atualizar Lista
            </Button>
            
            <Button onClick={handleGoToSite} variant="outline" className="w-full text-sm bg-white border-gray-300 text-gray-600 hover:text-intelis-blue hover:border-intelis-blue">
                <ExternalLink size={16} className="mr-2"/> Ver Site (Sem Deslogar)
            </Button>
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 bg-gray-100 flex flex-col h-screen overflow-hidden">
         {selectedUser ? (
             <div className="flex-1 overflow-y-auto p-8">
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     {/* Header Details */}
                     <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50 flex justify-between items-start">
                         <div>
                            <h1 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h1>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200"><User size={14} className="text-intelis-blue"/> {selectedUser.cpf}</span>
                                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200"><FileText size={14} className="text-intelis-blue"/> Título: {selectedUser.voterTitle}</span>
                                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200"><MapPin size={14} className="text-intelis-blue"/> {selectedUser.city}-{selectedUser.addressState}</span>
                            </div>
                         </div>
                         <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide border border-yellow-200 shadow-sm">
                             Pendente
                         </div>
                     </div>

                     {/* Biometry Check */}
                     <div className="p-6 grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                             <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                 <span className="w-2 h-2 bg-intelis-blue rounded-full"></span>
                                 Selfie (Biometria)
                             </h4>
                             <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden border-2 border-gray-300 relative shadow-inner group">
                                 {selectedUser.selfie ? (
                                     <img src={selectedUser.selfie} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                 ) : (
                                     <div className="flex items-center justify-center h-full text-gray-500">Sem foto</div>
                                 )}
                             </div>
                         </div>
                         <div className="space-y-2">
                             <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                 <span className="w-2 h-2 bg-intelis-blue rounded-full"></span>
                                 Documento (Frente)
                             </h4>
                             <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center relative shadow-inner">
                                 {/* In a real app, this would be the URL of the uploaded doc */}
                                 <FileText size={48} className="text-gray-300 mb-2" />
                                 <span className="text-gray-500 text-sm text-center px-4 absolute bottom-4 w-full">
                                     Visualização indisponível (Demo)
                                 </span>
                             </div>
                         </div>
                     </div>

                     {/* Data Grid */}
                     <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                         <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs">i</span>
                            Dados Cadastrais
                         </h4>
                         <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm bg-white p-4 rounded-lg border border-gray-200">
                             <div>
                                 <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Data de Nascimento</span>
                                 <span className="font-medium text-gray-800 text-base">{selectedUser.birthDate}</span>
                             </div>
                             <div>
                                 <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Nome da Mãe</span>
                                 <span className="font-medium text-gray-800 text-base">{selectedUser.motherName}</span>
                             </div>
                             <div>
                                 <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Email</span>
                                 <span className="font-medium text-gray-800 text-base">{selectedUser.email}</span>
                             </div>
                             <div>
                                 <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Telefone</span>
                                 <span className="font-medium text-gray-800 text-base">{selectedUser.phone}</span>
                             </div>
                         </div>
                     </div>

                     {/* Actions */}
                     <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                         <Button 
                            variant="outline" 
                            onClick={() => handleDecision(selectedUser.id!, 'rejected')}
                            isLoading={processing}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6"
                         >
                             <XCircle className="mr-2" size={18}/>
                             Rejeitar
                         </Button>
                         <Button 
                            onClick={() => handleDecision(selectedUser.id!, 'approved')}
                            isLoading={processing}
                            className="bg-green-600 hover:bg-green-700 px-8 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                         >
                             <CheckCircle className="mr-2" size={18}/>
                             Aprovar Filiação
                         </Button>
                     </div>
                 </div>
             </div>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                 <Search size={64} className="text-gray-200 mb-4"/>
                 <p className="text-lg font-medium text-gray-500">Selecione um cadastro ao lado</p>
                 <p className="text-sm">Clique em um nome na lista para auditar os dados.</p>
             </div>
         )}
      </div>
    </div>
  );
};
