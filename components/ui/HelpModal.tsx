import React from 'react';
import { X, MessageCircle, Mail, HelpCircle, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { SupportChat } from './SupportChat';

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
      question: "Estou com problemas técnicos, e agora?",
      answer: (
        <span>
          Caso o assistente virtual não resolva, você pode enviar um e-mail detalhado com prints do erro para <a href="mailto:suporte@intelis.org.br" className="text-intelis-blue font-bold underline">suporte@intelis.org.br</a>.
        </span>
      )
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
            <div>
                <h2 className="text-xl font-bold">Central de Ajuda</h2>
                <p className="text-xs text-gray-500">Tire suas dúvidas em tempo real</p>
            </div>
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
          
          {/* AI Agent Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
                <Bot className="text-green-500" size={20}/>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Assistente Virtual INTELiS</h3>
            </div>
            <SupportChat />
          </section>

          {/* Direct Contact Channels */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Outros Canais</h3>
            <div className="grid grid-cols-1 gap-4">
              <a 
                href="#" 
                className="flex items-center gap-4 p-4 border rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="p-3 bg-green-100 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <span className="font-semibold text-gray-800 block">WhatsApp Oficial</span>
                    <span className="text-xs text-gray-500">Falar com atendente humano (09h às 18h)</span>
                </div>
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
      </div>
    </div>
  );
};