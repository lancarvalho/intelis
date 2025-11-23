
import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { getPendingAffiliations, reviewAffiliation } from '../../services/api';
import { Button } from '../ui/Button';
import { AdminLogin } from './AdminLogin';
import { CheckCircle, XCircle, User, FileText, MapPin, RefreshCw, Search, LogOut, ExternalLink, ChevronLeft, Calendar, Phone, Mail } from 'lucide-react';

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
      onExit();
  };

  if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={onExit} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar List - Hidden on mobile if a user is selected (Master View) */}
      <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full z-10 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-intelis-darkBlue text-white flex justify-between items-center shadow-md shrink-0">
            <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Search size={20}/> Auditoria
                </h2>
                <p className="text-xs text-blue-200 mt-1">{pending.length} solicitações pendentes</p>
            </div>
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-transparent hover:border-red-400" 
                title="Sair do sistema"
            >
                SAIR <LogOut size={14} />
            </button>
        </div>
        
        <div className="overflow-y-auto flex-1 bg-gray-50">
            {loading ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3 mt-10">
                    <RefreshCw className="animate-spin text-intelis-blue" size={24} />
                    <span className="text-sm">Sincronizando dados...</span>
                </div>
            ) : pending.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center mt-10">
                    <div className="bg-green-100 p-4 rounded-full mb-3">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <p className="font-medium text-gray-800">Tudo em dia!</p>
                    <p className="text-xs mt-1">Nenhuma filiação pendente de análise.</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                {pending.map(user => (
                    <li 
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 cursor-pointer transition-all hover:bg-blue-50 relative ${selectedUser?.id === user.id ? 'bg-white border-l-4 border-l-intelis-blue shadow-sm' : 'bg-white border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`font-semibold text-sm ${selectedUser?.id === user.id ? 'text-intelis-blue' : 'text-gray-800'}`}>
                                {user.fullName}
                            </span>
                            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full uppercase">
                                Novo
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                             <User size={12} /> {user.cpf}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                             <MapPin size={12} /> {user.city}/{user.addressState}
                        </div>
                        <div className="absolute right-4 bottom-4 text-gray-300 md:hidden">
                            <ChevronLeft size={16} className="rotate-180" />
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex flex-col gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button onClick={loadData} variant="primary" className="w-full text-sm py-2 h-10">
                <RefreshCw size={16} className="mr-2"/> Atualizar Lista
            </Button>
            
            <Button onClick={handleGoToSite} variant="outline" className="w-full text-sm py-2 h-10 bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                <ExternalLink size={16} className="mr-2"/> Ver Site (Sem Sair)
            </Button>
        </div>
      </div>

      {/* Detail View - Full screen on mobile when selected */}
      <div className={`flex-1 bg-gray-100 flex flex-col h-full overflow-hidden relative ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
         {selectedUser ? (
             <div className="flex-1 flex flex-col h-full overflow-hidden">
                 {/* Mobile Header for Detail */}
                 <div className="md:hidden bg-white p-3 border-b flex items-center gap-3 sticky top-0 z-20 shadow-sm shrink-0">
                     <button 
                        onClick={() => setSelectedUser(null)} 
                        className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full active:bg-gray-200 transition-colors"
                     >
                         <ChevronLeft size={24} />
                     </button>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate text-sm leading-tight">{selectedUser.fullName}</h3>
                        <p className="text-xs text-gray-500">Análise de Filiação</p>
                     </div>
                 </div>

                 {/* Scrollable Content */}
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
                         {/* Header Details */}
                         <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-blue-50/50">
                             <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedUser.fullName}</h1>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
                                            <User size={12} className="text-intelis-blue"/> {selectedUser.cpf}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
                                            <FileText size={12} className="text-intelis-blue"/> Título: {selectedUser.voterTitle}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
                                            <MapPin size={12} className="text-intelis-blue"/> {selectedUser.city}-{selectedUser.addressState}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold uppercase tracking-wide border border-yellow-200 self-start shadow-sm">
                                    Status: Pendente
                                </div>
                             </div>
                         </div>

                         {/* Biometry Check */}
                         <div className="p-6 border-b border-gray-100">
                             <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                 <Search size={16} className="text-intelis-blue"/> Validação Visual
                             </h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                     <p className="text-xs font-medium text-gray-500 uppercase text-center">Selfie (Biometria)</p>
                                     <div className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden border border-gray-200 relative shadow-md group max-w-[200px] mx-auto">
                                         {selectedUser.selfie ? (
                                             <img src={selectedUser.selfie} className="w-full h-full object-cover" alt="Selfie" />
                                         ) : (
                                             <div className="flex items-center justify-center h-full text-gray-400 text-xs">Sem foto</div>
                                         )}
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <p className="text-xs font-medium text-gray-500 uppercase text-center">Documento (Frente)</p>
                                     <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative max-w-[200px] mx-auto">
                                         <FileText size={32} className="text-gray-300 mb-2" />
                                         <span className="text-gray-400 text-xs text-center px-4 absolute bottom-4 w-full">
                                             Documento protegido
                                         </span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Data Grid */}
                         <div className="p-6 bg-gray-50">
                             <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <FileText size={16} className="text-intelis-blue"/> Dados Cadastrais
                             </h4>
                             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase font-medium block mb-1">Data de Nascimento</span>
                                            <div className="text-sm text-gray-900 flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400"/> {selectedUser.birthDate}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase font-medium block mb-1">Nome da Mãe</span>
                                            <div className="text-sm text-gray-900 flex items-center gap-2">
                                                <User size={14} className="text-gray-400"/> {selectedUser.motherName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase font-medium block mb-1">E-mail</span>
                                            <div className="text-sm text-gray-900 flex items-center gap-2 break-all">
                                                <Mail size={14} className="text-gray-400"/> {selectedUser.email}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase font-medium block mb-1">Telefone</span>
                                            <div className="text-sm text-gray-900 flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400"/> {selectedUser.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
                
                 {/* Actions Toolbar */}
                 <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
                     <div className="max-w-5xl mx-auto flex gap-3 justify-end">
                         <Button 
                            variant="outline" 
                            onClick={() => handleDecision(selectedUser.id!, 'rejected')}
                            isLoading={processing}
                            className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                         >
                             <XCircle className="mr-2" size={18}/>
                             Rejeitar
                         </Button>
                         <Button 
                            onClick={() => handleDecision(selectedUser.id!, 'approved')}
                            isLoading={processing}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 shadow-md text-white"
                         >
                             <CheckCircle className="mr-2" size={18}/>
                             Aprovar Filiação
                         </Button>
                     </div>
                 </div>
             </div>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200">
                    <Search size={40} className="text-gray-300"/>
                 </div>
                 <h3 className="text-lg font-bold text-gray-600 mb-2">Nenhum cadastro selecionado</h3>
                 <p className="text-sm text-gray-500 max-w-xs mx-auto">
                     Selecione um nome na lista lateral para visualizar os detalhes e realizar a auditoria.
                 </p>
             </div>
         )}
      </div>
    </div>
  );
};
