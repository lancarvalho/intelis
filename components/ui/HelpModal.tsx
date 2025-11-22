import React from 'react';
import { X, MessageCircle, Mail, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      question: "A filiação é gratuita?",
      answer: "Sim! A filiação ao INTELIGENTES é totalmente gratuita e não há cobrança de mensalidade obrigatória."
    },
    {
      question: "Quais documentos são necessários?",
      answer: "Você precisará apenas de um documento oficial com foto (RG ou CNH) e estar em dia com a Justiça Eleitoral."
    },
    {
      question: "Quanto tempo demora a aprovação?",
      answer: "Nosso sistema realiza validações automáticas. Se tudo estiver correto, sua filiação é processada em até 48 horas."
    },
    {
      question: "Onde encontro o número do meu Título?",
      answer: "Você pode consultar o número do seu Título de Eleitor no site do TSE ou no aplicativo e-Título."
    },
    {
      question: "Estou com problemas na câmera/selfie",
      answer: "Verifique se você deu permissão ao navegador para acessar sua câmera. Tente limpar o cache ou usar outro navegador se o problema persistir."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-intelis-darkBlue">
            <div className="p-2 bg-blue-50 rounded-lg">
               <HelpCircle size={24} className="text-intelis-blue" />
            </div>
            <h2 className="text-xl font-bold">Precisa de Ajuda?</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Direct Contact Channels */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Canais de Atendimento</h3>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="#" 
                className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <MessageCircle size={32} className="text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-800">WhatsApp</span>
                <span className="text-xs text-gray-500">Resposta rápida</span>
              </a>
              <a 
                href="mailto:suporte@intelis.org.br" 
                className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-intelis-blue hover:bg-blue-50 transition-all group"
              >
                <Mail size={32} className="text-intelis-blue mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-800">E-mail</span>
                <span className="text-xs text-gray-500">suporte@intelis.org.br</span>
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Dúvidas Frequentes</h3>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-700 text-sm">{faq.question}</span>
                    {openFaq === index ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {openFaq === index && (
                    <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl text-center">
           <p className="text-xs text-gray-500">
             Nosso horário de atendimento é de Segunda a Sexta, das 09h às 18h.
           </p>
        </div>

      </div>
    </div>
  );
};