import React from 'react';
import { X, Shield, FileText, Lock } from 'lucide-react';
import { Button } from './Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3 text-intelis-darkBlue">
            <div className="p-2 bg-white border border-gray-200 rounded-lg">
               <FileText size={24} className="text-intelis-blue" />
            </div>
            <div>
                <h2 className="text-xl font-bold">Termos de Uso e Privacidade</h2>
                <p className="text-xs text-gray-500">Última atualização: Novembro de 2025</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 space-y-6 text-gray-700 text-sm leading-relaxed text-justify">
          
          <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2 flex items-center gap-2">
                1. Aceitação e Natureza do Vínculo
            </h3>
            <p>
              Ao solicitar sua filiação ao <strong>INTELIGENTES (INTELiS)</strong>, você declara estar em pleno gozo de seus direitos políticos e concorda voluntariamente com o Estatuto Partidário, o Código de Ética e o Programa do Partido. A filiação partidária cria um vínculo jurídico e político, sujeito às normas da Lei nº 9.096/95 (Lei dos Partidos Políticos) e às resoluções do Tribunal Superior Eleitoral (TSE).
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2 flex items-center gap-2">
                <Shield size={16} className="text-intelis-green"/>
                2. Privacidade e Tratamento de Dados (LGPD)
            </h3>
            <p className="mb-2">
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), informamos que seus dados pessoais sensíveis (incluindo filiação política, dados biométricos e documentos) serão coletados e tratados para as seguintes finalidades exclusivas:
            </p>
            <ul className="list-disc pl-5 space-y-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <li>Registro oficial de filiação junto à Justiça Eleitoral (Sistema FILIA/TSE);</li>
                <li>Comunicação institucional, convocação para convenções e informativos políticos;</li>
                <li>Auditoria interna de segurança e validação de identidade (prevenção a fraudes);</li>
                <li>Estatísticas internas anonimizadas para estratégias partidárias.</li>
            </ul>
            <p className="mt-2">
              O INTELiS garante que seus dados não serão comercializados com terceiros. O compartilhamento ocorrerá estritamente com órgãos governamentais (TSE/TRE) por obrigação legal.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2">
                3. Veracidade das Informações e Biometria
            </h3>
            <p>
              O usuário declara que todas as informações fornecidas são verdadeiras, sob as penas da lei (Art. 299 do Código Penal - Falsidade Ideológica). O sistema utiliza tecnologias de reconhecimento facial e análise documental para validar sua identidade. O envio de documentos falsos ou de terceiros acarretará no cancelamento imediato do pedido e notificação às autoridades competentes.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2">
                4. Fidelidade e Dupla Filiação
            </h3>
            <p>
              É vedada a filiação a mais de um partido político simultaneamente. Ao ter sua filiação deferida pelo INTELiS, qualquer filiação anterior a outra agremiação será automaticamente cancelada pela Justiça Eleitoral. O filiado compromete-se a defender os valores da vida, liberdade, propriedade privada e família, conforme preceitua o Estatuto.
            </p>
          </section>

          <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2">
                5. Segurança da Conta
            </h3>
            <p>
              O acesso ao Painel do Filiado é pessoal e intransferível, realizado mediante autenticação segura (CPF e Biometria). É responsabilidade do usuário manter seus dispositivos seguros e comunicar imediatamente o partido em caso de suspeita de uso indevido de seus dados.
            </p>
          </section>

           <section>
            <h3 className="text-base font-bold text-intelis-darkBlue mb-2">
                6. Disposições Gerais
            </h3>
            <p>
              O partido reserva-se o direito de indeferir pedidos de filiação que não estejam alinhados com o Estatuto ou que apresentem inconsistências documentais. Este termo é regido pelas leis da República Federativa do Brasil, elegendo-se o foro de Brasília-DF para dirimir quaisquer dúvidas.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
           <Button variant="outline" onClick={onClose}>
             Fechar
           </Button>
           {onAccept && (
             <Button onClick={onAccept} className="bg-intelis-blue hover:bg-blue-800">
               Li e Concordo
             </Button>
           )}
        </div>

      </div>
    </div>
  );
};