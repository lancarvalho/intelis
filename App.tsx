
import React, { useState, useEffect } from 'react';
import { Stepper } from './components/Stepper';
import { Step1_Personal } from './components/steps/Step1_Personal';
import { Step2_Address } from './components/steps/Step2_Address';
import { Step3_Complementary } from './components/steps/Step3_Complementary';
import { Step4_Interests } from './components/steps/Step4_Interests';
import { Step5_Documents } from './components/steps/Step5_Documents';
import { Step6_Selfie } from './components/steps/Step6_Selfie';
import { MemberPanel } from './components/MemberPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { HelpModal } from './components/ui/HelpModal';
import { FormData, INITIAL_DATA, Steps, ValidationErrors } from './types';
import { validateCPF, validateEmail, formatCPF, validateFullName, validateAge } from './utils/validators';
import { fetchUserDataByCPF, simulateBiometricAuth, submitUpdateForReview, sendWelcomeEmail } from './services/api';
import { generateAffiliationPDF } from './services/pdfGenerator';
import { HelpCircle, ChevronLeft, ArrowRight, CheckCircle, Fingerprint, ScanFace, Download, FileText, Shield } from 'lucide-react';

// Image Assets
const ICON_URL = 'https://renatorgomes.com/backup/intelis/icone.png';
const LOGO_URL = 'https://renatorgomes.com/backup/intelis/inteligentes.png';

function App() {
  const [view, setView] = useState<'HOME' | 'UPDATE_AUTH' | 'MEMBER_PANEL' | 'FORM' | 'SUCCESS' | 'ADMIN'>('HOME');
  const [currentStep, setCurrentStep] = useState(Steps.PERSONAL);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingBio, setLoadingBio] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [authCpf, setAuthCpf] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const updateData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const handleStartFilizacao = () => {
    setFormData(INITIAL_DATA);
    setIsUpdating(false);
    setCurrentStep(Steps.PERSONAL);
    setView('FORM');
  };

  const handleStartUpdate = () => {
    setAuthCpf('');
    setView('UPDATE_AUTH');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCPF(authCpf)) {
        alert("CPF Inválido");
        return;
    }
    setLoadingAuth(true);
    const data = await fetchUserDataByCPF(authCpf);
    setLoadingAuth(false);

    if (data) {
      setFormData(data);
      setIsUpdating(true);
      setView('MEMBER_PANEL');
    } else {
      alert('CPF não encontrado na base de dados. (Use 123.456.789-00 para teste)');
    }
  };

  const handleBiometricAuth = async () => {
      if (!authCpf || !validateCPF(authCpf)) {
          alert("Por favor, digite um CPF válido antes de iniciar a biometria.");
          return;
      }
      
      setLoadingBio(true);
      // First fetch data to ensure user exists
      const data = await fetchUserDataByCPF(authCpf);
      
      if (!data) {
          setLoadingBio(false);
          alert('CPF não encontrado na base de dados.');
          return;
      }

      const bioSuccess = await simulateBiometricAuth();
      setLoadingBio(false);

      if (bioSuccess) {
          setFormData(data);
          setIsUpdating(true);
          setView('MEMBER_PANEL');
      } else {
          alert("Falha na autenticação biométrica. Tente novamente.");
      }
  };

  const handleEditStep = (step: number) => {
      setCurrentStep(step);
      setView('FORM');
  };

  const handleSubmitReview = async () => {
      setSubmittingReview(true);
      const result = await submitUpdateForReview(formData);
      setSubmittingReview(false);
      
      if (result.success) {
          setSuccessMessage(result.message);
          setView('SUCCESS');
      }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (step === Steps.PERSONAL) {
      if (!formData.fullName) {
        newErrors.fullName = 'Nome é obrigatório';
      } else if (!validateFullName(formData.fullName)) {
        newErrors.fullName = 'O nome deve ser completo, sem números ou caracteres especiais.';
      }
      
      if (!formData.birthDate) {
        newErrors.birthDate = 'Data de nascimento obrigatória';
      } else if (!validateAge(formData.birthDate)) {
        newErrors.birthDate = 'Idade deve ser entre 16 e 100 anos.';
      }

      if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
      if (!formData.phone) newErrors.phone = 'Telefone obrigatório';
      if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
      if (!formData.termsAccepted) newErrors.termsAccepted = 'Você precisa aceitar os termos';
      if (!formData.statuteAccepted) newErrors.statuteAccepted = 'Você precisa aceitar o estatuto';
    }
    
    if (step === Steps.ADDRESS) {
        if (!formData.cep) newErrors.cep = 'CEP obrigatório';
        if (!formData.street) newErrors.street = 'Endereço obrigatório';
        if (!formData.number) newErrors.number = 'Número obrigatório';
        if (!formData.district) newErrors.district = 'Bairro obrigatório';
        if (!formData.city) newErrors.city = 'Cidade obrigatória';
        if (!formData.addressState) newErrors.addressState = 'Estado obrigatório';
    }

    if (step === Steps.COMPLEMENTARY) {
       if (!formData.voterTitle) newErrors.voterTitle = "Título de eleitor obrigatório";
       if (!formData.electoralState) newErrors.electoralState = "Estado eleitoral obrigatório";
       if (!formData.electoralCity) newErrors.electoralCity = "Município eleitoral obrigatório";
       
       if (!formData.motherName) {
         newErrors.motherName = "Nome da mãe obrigatório";
       } else if (!validateFullName(formData.motherName)) {
         newErrors.motherName = "Nome da mãe deve ser completo, sem números ou caracteres especiais.";
       }

       if (formData.isCandidate) {
           if (!formData.politicalName) newErrors.politicalName = "Nome político obrigatório";
           if (!formData.politicalOffice) newErrors.politicalOffice = "Cargo obrigatório";
       }
    }

    // For update flow, we might relax document requirements if they are already present,
    // but for simplicity we keep validation logic consistent.
    if (step === Steps.DOCUMENTS && !isUpdating) {
        if (!formData.docFront) isValid = false;
        if (!formData.docBack) isValid = false;
        if (!formData.signature) isValid = false;
    }
    
    if (step === Steps.SELFIE && !isUpdating) {
        if (!formData.selfie) isValid = false;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (isUpdating) {
          // In update mode, "Next/Save" goes back to panel
          setView('MEMBER_PANEL');
      } else {
          // In create mode, linear progression
          if (currentStep < Steps.SELFIE) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
          } else {
            setView('SUCCESS');
            // Simulate sending welcome email with attachment logic handled on backend
            await sendWelcomeEmail(formData); 
          }
      }
    } else {
        if (currentStep === Steps.DOCUMENTS && !isUpdating) {
            if (!formData.docFront || !formData.docBack) {
                alert("Por favor, anexe as fotos do documento.");
            } else if (!formData.signature) {
                alert("Por favor, assine no campo indicado.");
            }
        }
        if (currentStep === Steps.SELFIE && !formData.selfie && !isUpdating) {
            alert("Por favor, tire uma selfie para continuar.");
        }
    }
  };

  const handleBack = () => {
    if (isUpdating) {
        setView('MEMBER_PANEL');
    } else {
        if (currentStep > Steps.PERSONAL) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        } else {
            setView('HOME');
        }
    }
  };

  // --- Views ---

  if (view === 'ADMIN') {
      return <AdminPanel onExit={() => setView('HOME')} />;
  }

  if (view === 'HOME') {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        
        {/* PWA Install Button (Mobile/Desktop) */}
        {showInstallBtn && (
            <div className="fixed top-4 right-4 z-50 animate-bounce">
                <button 
                    onClick={handleInstallClick}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium text-sm"
                >
                    <Download size={16} />
                    Instalar App
                </button>
            </div>
        )}

        {/* Left Hero */}
        <div className="w-full md:w-1/2 bg-intelis-blue p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden min-h-[50vh] md:min-h-screen">
          <div className="z-10 mt-8 md:mt-0">
             <div className="mb-8">
                <img src={LOGO_URL} alt="INTELIGENTES" className="h-16 md:h-20 object-contain" />
             </div>
             <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
               Faça parte da <br/>
               nossa luta, <br/>
               <span className="text-green-400">Filie-se!</span>
             </h2>
             <p className="text-blue-100 text-base md:text-lg max-w-md">
               Junte-se a nós para construir um futuro mais inteligente, conectado e justo para todos.
             </p>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
          </div>
          
          {/* Secret Admin Link in Footer */}
          <div className="z-10 text-xs text-blue-300 mt-auto">
              <button onClick={() => setView('ADMIN')} className="hover:text-white transition-colors flex items-center gap-1">
                  <Shield size={10} /> Área Administrativa
              </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8 bg-gray-50 min-h-[50vh] md:min-h-screen">
           <div className="w-full max-w-md space-y-6">
              <Button 
                onClick={handleStartFilizacao} 
                className="w-full h-14 md:h-16 text-lg md:text-xl shadow-lg"
              >
                FILIAR
              </Button>
              
              <Button 
                onClick={handleStartUpdate} 
                variant="outline" 
                className="w-full h-14 md:h-16 text-lg md:text-xl bg-white"
              >
                ATUALIZAR CADASTRO
              </Button>

              <div className="mt-8 md:mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                         <img src={ICON_URL} alt="Idea" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                          <h3 className="font-bold text-intelis-darkBlue mb-1">Por que se filiar?</h3>
                          <p className="text-sm text-gray-600">
                              Participação ativa nas decisões, cursos de formação política e oportunidade de candidatura.
                          </p>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'UPDATE_AUTH') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-intelis-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                      <ScanFace size={32} />
                   </div>
                   <h2 className="text-2xl font-bold text-intelis-darkBlue">Área do Filiado</h2>
                   <p className="text-gray-600">Identifique-se para acessar seu painel</p>
                </div>
                
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                    <Input 
                        label="CPF" 
                        value={authCpf} 
                        onChange={(e) => setAuthCpf(formatCPF(e.target.value))} 
                        placeholder="000.000.000-00"
                        required
                        inputMode="numeric"
                    />

                    <div className="space-y-3">
                        <Button 
                            type="button" 
                            onClick={handleBiometricAuth}
                            isLoading={loadingBio}
                            disabled={loadingAuth}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
                        >
                             {!loadingBio && <Fingerprint className="mr-2" />}
                             {loadingBio ? 'Validando Biometria...' : 'Acessar com Biometria Digital'}
                        </Button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <Button 
                            type="submit" 
                            variant="outline" 
                            isLoading={loadingAuth} 
                            disabled={loadingBio}
                            className="w-full h-12"
                        >
                            Entrar sem Biometria
                        </Button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setView('HOME')} className="text-sm text-gray-500 hover:text-intelis-blue underline">
                        Voltar ao início
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-8 text-center">Ambiente seguro. Use 123.456.789-00 para simular.</p>
            </div>
        </div>
      )
  }

  if (view === 'MEMBER_PANEL') {
      return (
          <div className="min-h-screen bg-gray-50 pb-safe">
               <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
               {/* Header Simple */}
               <div className="bg-white shadow-sm border-b sticky top-0 z-40 safe-top">
                  <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-intelis-blue font-bold text-xl">
                         <img src={ICON_URL} alt="Logo" className="w-8 h-8 object-contain" />
                         INTELiS
                      </div>
                      <button onClick={() => setView('HOME')} className="text-sm text-gray-500 hover:text-red-500">
                          Sair
                      </button>
                  </div>
               </div>

               <div className="max-w-6xl mx-auto px-4 py-8">
                   <MemberPanel 
                      data={formData} 
                      onEditStep={handleEditStep} 
                      onSubmitReview={handleSubmitReview}
                      isSubmitting={submittingReview}
                   />
               </div>
          </div>
      )
  }

  if (view === 'SUCCESS') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-intelis-blue p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-lg animate-fade-in w-full">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      {isUpdating ? 'Sucesso!' : 'Filiação Recebida!'}
                  </h2>
                  <p className="text-gray-600 mb-8 text-base md:text-lg">
                      {successMessage || "Seus dados foram processados com sucesso. Enviamos a ficha de filiação para o seu e-mail."}
                  </p>
                  
                  {!isUpdating && (
                    <Button 
                        onClick={() => generateAffiliationPDF(formData)} 
                        variant="secondary" 
                        className="w-full mb-4 flex items-center justify-center"
                    >
                        <FileText className="mr-2" size={20} />
                        Baixar Ficha de Filiação
                    </Button>
                  )}

                  <Button onClick={() => setView('HOME')} className="w-full">
                      Voltar ao Início
                  </Button>
              </div>
          </div>
      )
  }

  // --- Main Form View (Used for Registration AND Editing) ---

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      {/* Left Sidebar (Persistent on Desktop) */}
      <div className="hidden md:flex w-1/3 bg-intelis-blue p-12 flex-col justify-between text-white relative fixed h-screen">
        <div>
            <div className="flex items-center gap-3 mb-12">
                 <img src={ICON_URL} alt="Icone" className="w-10 h-10 bg-white rounded p-1 object-contain" />
                 <span className="font-bold text-xl tracking-widest">INTELiS</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-snug mb-4">
              {isUpdating ? 'Editando Cadastro' : 'Faça parte da nossa luta, Filie-se!'}
            </h2>
            <p className="text-blue-100">
              {isUpdating 
                ? 'Altere os campos necessários e clique em salvar para retornar ao seu painel.'
                : 'Preencha a ficha de filiação para se tornar um filiado.'
              }
            </p>
        </div>

        <div className="bg-intelis-darkBlue bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
            <button 
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-2 text-green-400 font-bold hover:text-white transition-colors"
            >
                <HelpCircle size={20} />
                Precisa de Ajuda?
            </button>
        </div>
         {/* Background Pattern */}
          <div className="absolute bottom-0 right-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                  <path d="M0 200 L200 0 L200 200 Z" fill="white" />
              </svg>
          </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-2/3 flex flex-col h-screen overflow-y-auto bg-gray-50">
        {/* Mobile Header */}
        <div className="md:hidden bg-intelis-blue text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md safe-top">
            <div className="flex items-center gap-2">
               <img src={ICON_URL} alt="Icone" className="w-6 h-6 bg-white rounded p-0.5 object-contain" />
               <span className="font-bold">INTELiS</span>
            </div>
            <button 
                onClick={() => setIsHelpOpen(true)}
                className="text-sm bg-green-500 px-3 py-1 rounded hover:bg-green-600 font-medium"
            >
                Ajuda
            </button>
        </div>

        <div className="flex-1 p-4 md:p-12 max-w-3xl mx-auto w-full pb-24 md:pb-12">
            
            {/* Only show Stepper in Creation Mode to avoid confusion in Edit Mode */}
            {!isUpdating && <Stepper currentStep={currentStep} />}
            
            {isUpdating && (
                 <div className="mb-6 flex items-center text-gray-500">
                     <span className="font-medium text-intelis-blue">Editando:</span>
                     <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                         {currentStep === Steps.PERSONAL && 'Dados Pessoais'}
                         {currentStep === Steps.ADDRESS && 'Endereço'}
                         {currentStep === Steps.COMPLEMENTARY && 'Dados Complementares'}
                         {currentStep === Steps.INTERESTS && 'Interesses'}
                         {currentStep === Steps.DOCUMENTS && 'Documentos'}
                         {currentStep === Steps.SELFIE && 'Selfie'}
                     </span>
                 </div>
            )}

            <div className="mt-4 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                {currentStep === Steps.PERSONAL && (
                    <Step1_Personal data={formData} updateData={updateData} errors={errors} isUpdating={isUpdating} />
                )}
                {currentStep === Steps.ADDRESS && (
                    <Step2_Address data={formData} updateData={updateData} errors={errors} />
                )}
                {currentStep === Steps.COMPLEMENTARY && (
                    <Step3_Complementary data={formData} updateData={updateData} errors={errors} isUpdating={isUpdating} />
                )}
                {currentStep === Steps.INTERESTS && (
                    <Step4_Interests data={formData} updateData={updateData} />
                )}
                {currentStep === Steps.DOCUMENTS && (
                    <Step5_Documents data={formData} updateData={updateData} />
                )}
                {currentStep === Steps.SELFIE && (
                    <Step6_Selfie data={formData} updateData={updateData} />
                )}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between mt-8 pb-8">
                <button 
                    onClick={handleBack}
                    className="flex items-center text-gray-500 hover:text-intelis-blue font-medium px-4 py-2"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    {isUpdating ? 'Cancelar e Voltar' : (currentStep === Steps.PERSONAL ? 'Voltar ao início' : 'Voltar')}
                </button>

                <Button onClick={handleNext} className="px-6 md:px-8">
                    {isUpdating ? 'Salvar Alterações' : (currentStep === Steps.SELFIE ? 'Finalizar' : 'Avançar')}
                    {!isUpdating && currentStep !== Steps.SELFIE && <ArrowRight size={20} className="ml-2" />}
                    {isUpdating && <CheckCircle size={20} className="ml-2" />}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
