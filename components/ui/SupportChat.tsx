import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ThumbsUp } from 'lucide-react';
import { Button } from './Button';

interface Message {
  id: string;
  text: React.ReactNode;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Olá! Sou o assistente virtual do INTELIGENTES. Estou aqui para te ajudar a se filiar ou tirar dúvidas sobre o partido. Como posso ajudar hoje?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  // Simple Heuristic "AI" for the party context
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('título') || q.includes('eleitor')) return "O Título de Eleitor é obrigatório. Você pode encontrá-lo no app e-Título ou no site do TSE. Se não tiver o número agora, você pode consultar online no site do TSE.";
    if (q.includes('foto') || q.includes('selfie') || q.includes('câmera')) return "A selfie é usada para validação biométrica de segurança. Certifique-se de estar em um local iluminado, sem óculos escuros ou boné. Se a câmera não abrir, verifique as permissões do navegador.";
    if (q.includes('documento') || q.includes('rg') || q.includes('cnh')) return "Aceitamos RG ou CNH. As fotos devem estar legíveis (frente e verso). O sistema aceita arquivos JPG ou PNG de até 5MB.";
    if (q.includes('pagar') || q.includes('valor') || q.includes('custo') || q.includes('mensalidade')) return "A filiação ao INTELIGENTES é totalmente gratuita! Não cobramos taxa de adesão nem mensalidade obrigatória.";
    if (q.includes('filiado') || q.includes('outro partido')) return "Pela legislação, ao se filiar ao INTELIGENTES, sua filiação anterior a outro partido será cancelada automaticamente pela Justiça Eleitoral.";
    if (q.includes('aprovação') || q.includes('tempo') || q.includes('demora')) return "Após o envio, nossa equipe analisa os dados em até 48 horas úteis. Você receberá um e-mail de confirmação.";
    if (q.includes('erro') || q.includes('problema') || q.includes('não consigo')) return "Sinto muito pelo problema. Tente atualizar a página. Se o erro persistir, envie um print para nosso suporte técnico no e-mail suporte@intelis.org.br.";
    if (q.includes('estatuto') || q.includes('ideologia') || q.includes('valores')) return "O INTELIGENTES defende a liberdade, a propriedade privada, a família e a livre iniciativa. Você pode baixar nosso Estatuto completo na etapa de Dados Pessoais.";
    
    return "Entendi. Para essa questão específica, sugiro consultar nosso FAQ ou enviar um e-mail para nossa equipe humana. Posso ajudar com algo mais sobre o preenchimento da ficha?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseText = generateResponse(userMsg.text as string);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-intelis-blue text-white' : 'bg-green-500 text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-intelis-blue text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                   <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua dúvida..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-intelis-blue text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-intelis-blue text-white p-2 rounded-full hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};