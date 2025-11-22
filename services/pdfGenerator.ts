import { jsPDF } from "jspdf";
import { FormData } from "../types";

// Helper to wrap text
const splitText = (doc: jsPDF, text: string, maxWidth: number) => {
  return doc.splitTextToSize(text, maxWidth);
};

export const generateAffiliationPDF = (data: FormData) => {
  const doc = new jsPDF();
  const blueColor = "#004e89";

  // --- Borda Principal ---
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // --- Cabeçalho ---
  // Logo (Texto simulado pois não temos a imagem em base64 aqui, mas a lógica seria doc.addImage)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blueColor);
  doc.setFontSize(24);
  doc.text("INTELIGENTES", 20, 25);
  
  // Logo symbol simulation
  doc.setDrawColor("#28a745");
  doc.setLineWidth(1);
  doc.circle(70, 18, 2);
  doc.line(70, 18, 75, 13);
  doc.circle(75, 13, 1.5);
  doc.line(70, 18, 65, 13);
  doc.circle(65, 13, 1.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("FICHA DE FILIAÇÃO PARTIDÁRIA", 130, 20);
  doc.setFontSize(10);
  doc.text("INTELIGENTES - INTELiS", 130, 26);
  doc.text("CNPJ: 35.779.882/0001-10 (Simulado)", 130, 32);

  // Linha separadora
  doc.setDrawColor(blueColor);
  doc.setLineWidth(1);
  doc.line(10, 40, 200, 40);
  
  // Subtítulo Legal
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Resolução-TSE nº 23.571/2018, art. 12, §1º (Lei nº 9.096/95, art 9º, §1º)", 105, 45, { align: "center" });

  // --- Dados do Filiado (Grid) ---
  const startY = 50;
  const rowHeight = 10;

  // Nome
  doc.rect(10, startY, 190, rowHeight + 5);
  doc.setFontSize(7);
  doc.setTextColor(blueColor);
  doc.text("Nome do(a) filiado(a)", 12, startY + 4);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(data.fullName.toUpperCase(), 12, startY + 10);

  // Data, Título, Zona, Seção
  const row2Y = startY + 15;
  doc.rect(10, row2Y, 190, rowHeight + 5);
  
  // Linhas verticais
  doc.line(60, row2Y, 60, row2Y + 15); // After Data
  doc.line(120, row2Y, 120, row2Y + 15); // After Titulo
  doc.line(155, row2Y, 155, row2Y + 15); // After Zona

  // Labels e Dados
  doc.setFontSize(7);
  doc.setTextColor(blueColor);
  doc.text("Data de Nascimento", 12, row2Y + 4);
  doc.text("Nº do Título", 62, row2Y + 4);
  doc.text("Zona", 122, row2Y + 4);
  doc.text("Seção", 157, row2Y + 4);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(data.birthDate.split('-').reverse().join('/'), 12, row2Y + 10);
  doc.text(data.voterTitle, 62, row2Y + 10);
  doc.text(data.electoralCity, 122, row2Y + 10); // Usando Cidade como placeholder de Zona se não tiver
  doc.text("---", 157, row2Y + 10);

  // --- Declaração e Assinatura ---
  const declY = row2Y + 15;
  doc.rect(10, declY, 155, 50); // Caixa assinatura
  doc.rect(165, declY, 35, 50); // Caixa digital

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARO ADERIR AO PROGRAMA E ESTATUTO DESTE PARTIDO E", 87, declY + 10, { align: "center" });
  doc.text("NÃO SER FILIADO(A) A NENHUMA OUTRA AGREMIAÇÃO", 87, declY + 15, { align: "center" });

  // Linha assinatura
  doc.line(30, declY + 35, 145, declY + 35);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Assinatura do(a) filiado(a)", 87, declY + 40, { align: "center" });

  // Digital
  doc.setFontSize(7);
  doc.text("Impressão digital", 182.5, declY + 25, { align: "center" });
  doc.text("(somente para analfabetos)", 182.5, declY + 29, { align: "center" });

  // --- Declaração do Recrutador (Simulado) ---
  const recY = declY + 60;
  doc.setFontSize(9);
  doc.text("Eu, ___________________________________________________ , Título de Eleitor __________________", 10, recY);
  doc.text("DECLARO, SOB AS PENAS DA LEI, QUE COLHI PESSOALMENTE A ASSINATURA DESSE(A) FILIADO(A).", 105, recY + 8, { align: "center" });

  // --- Instruções ---
  const instY = recY + 25;
  doc.rect(10, instY, 190, 35);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blueColor);
  doc.text("INSTRUÇÕES", 15, instY + 6);
  
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  const instructions = [
    "1. Esta ficha atesta sua vontade de se filiar ao INTELIGENTES.",
    "2. O Partido processará sua filiação junto à Justiça Eleitoral.",
    "3. Mantenha seus dados sempre atualizados através do Painel do Filiado.",
    "4. Convide familiares e amigos para se filiarem ao INTELIGENTES."
  ];
  
  let iY = instY + 12;
  instructions.forEach(inst => {
    doc.text(inst, 15, iY);
    iY += 5;
  });

  // --- Rodapé ---
  const footY = 260;
  doc.setFillColor(230, 230, 230);
  doc.rect(10, footY, 190, 15, "F");
  doc.setFontSize(12);
  doc.setTextColor(blueColor);
  doc.setFont("helvetica", "bold");
  doc.text("Inteligentes - Sede Nacional - Brasília/DF", 105, footY + 9, { align: "center" });

  doc.save("Ficha-Filiacao-INTELIGENTES.pdf");
};

export const generateStatutePDF = () => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 6;
  const pageHeight = 280;
  const margin = 20;
  const maxWidth = 170;

  const addText = (text: string, isTitle = false, isSubtitle = false) => {
    if (y > pageHeight) {
      doc.addPage();
      y = 20;
    }

    if (isTitle) {
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.text(text, 105, y, { align: "center" });
      y += 10;
    } else if (isSubtitle) {
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text(text, margin, y);
      y += 8;
    } else {
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y, { align: "justify", maxWidth: maxWidth });
      y += lines.length * lineHeight;
    }
    y += 2;
  };

  addText("ESTATUTO PARTIDO INTELIGENTES - INTELiS", true);

  addText("O PARTIDO E SEUS OBJETIVOS", false, true);
  addText("Art. 1º O Inteligentes é partido político com personalidade jurídica de direito privado e sem fins lucrativos, formado com base na legislação vigente e nos preceitos de seu programa e deste estatuto, para atuação em todo território nacional por prazo indeterminado.");
  addText("§ 1º Tem sede, foro, domicílio e representação nacional em Brasília, capital da República, exercida conforme orientação estatutária por meio de seu Presidente Nacional e pelos Presidentes Estaduais e Municipais nos assuntos relacionados às respectivas circunscrições.");
  addText("§ 2º Utilizará a denominação abreviada Intelis, tendo como símbolo dois aros interligados nas cores verde e amarelo e identificado pelo número 38.");
  
  addText("Art. 2º O Inteligentes – Intelis constitui-se como instrumento de realização do processo político, fiel à Constituição da República do Brasil e aos princípios da soberania popular e da representação política, da separação de poderes, do estado democrático de direito, da forma federativa, da limitação do poder, da periodicidade dos mandatos, da moralidade, da transparência, da eficiência, da descentralização, da austeridade, da responsabilidade, da meritocracia e da evolução gradual e natural da sociedade para a permanente proteção da vida, da família, das liberdades individuais, da legítima defesa, da propriedade privada, da livre iniciativa, dos valores culturais e religiosos dos brasileiros, defendendo a garantia da ordem social, moral e jurídica, da segurança pública e da estabilidade política e econômica, a fim de formar cidadãos livres e conscientes e garantir-lhes voz, unindo todos aqueles que estejam sob a bandeira do amor à pátria e contrários a tentativas ideológicas tendentes desvirtuar os valores mais caros aos brasileiros, desestabilizar a sociedade e confrontar a soberania nacional.");
  addText("Parágrafo único. O Programa do Inteligentes e seu Código de Ética são partes integrantes do presente Estatuto e deverão ser observados em suas integralidades.");
  
  addText("Art. 3º O Inteligentes será considerada extinta, para todos os efeitos legais, mediante deliberação de dois terços da Convenção Nacional.");

  addText("DA FILIAÇÃO PARTIDÁRIA", false, true);
  addText("PROCEDIMENTOS", false, true);
  addText("Art. 4º Poderão filiar-se ao Intelis os eleitores em pleno gozo dos seus direitos políticos que se proponham a aceitar, respeitar e difundir fielmente as diretrizes do programa fundador e os preceitos deste Estatuto.");
  addText("Art. 5º A filiação partidária no Inteligentes tem caráter permanente e validade em todo o território nacional.");
  addText("Art. 6º A filiação será processada segundo as seguintes formalidades:");
  addText("I - O proponente deverá preencher formulário disponível no sítio eletrônico oficial do Inteligentes, no qual deverá informar dados pessoais e contato atualizados, além assinalar sua concordância com as diretrizes e preceitos de seu programa e estatuto;");
  addText("II - Preenchido o formulário, o eleitor será exclusivamente responsável pela veracidade e transmissão dos dados;");
  addText("III - finalizado o processo de transmissão, o eleitor receberá um recibo da proposta de filiação, que será avaliado pela agremiação;");
  addText("IV - Aceita a filiação, o eleitor receberá mensagem na qual constará o número de inscrição;");
  addText("V - A eficácia da filiação no tempo retroage à data do pedido de filiação;");

  addText("Art. 7º Será observado o seguinte rito de validação da filiação partidária:");
  addText("I - Recebida a filiação por meio eletrônico, os dados nela constantes serão exibidos em página própria, durante 3 dias, para consulta e eventual impugnação justificada por parte de filiado ativo.");
  addText("II - Após exame de validade da impugnação, é assegurado ao impugnado igual prazo para contestação;");
  addText("III - Não havendo impugnação ou sendo não sendo ela rejeitada de plano, será expedido o comunicado de aceite como filiado ativo.");
  addText("Parágrafo único. É da responsabilidade do filiado informar alterações em seus dados cadastrais no site do Inteligentes, mediante senha própria e exclusiva.");

  addText("DOS DIREITOS E DEVERES DOS FILIADOS", false, true);
  addText("Art. 8º Ao filiado é assegurado o direito de participar de todas as atividades partidárias, postular cargos eletivos e da administração interna.");
  addText("Art. 9º São direitos dos filiados: I - Participar das Convenções e demais eventos partidários; II - Votar e ser votado para os cargos administrativos e para postulação de mandatos eletivos; III - manifestar-se em reuniões partidárias.");
  addText("Art. 11. São deveres dos filiados ao Intelis: I - Participar das convenções municipais; II - Participar das campanhas eleitorais; III - contribuir na forma estabelecida; IV - Acatar e respeitar os postulados e normas estatutárias.");

  addText("Art. 12. O Inteligentes exige de todos seus filiados o compromisso na defesa dos temas: I - Defesa da democracia, da soberania popular e da representação política; II - Respeito aos valores culturais e religiosos e à identidade do povo brasileiro; III - defesa da vida e do direito à legítima defesa, inclusive através da garantia do acesso às armas; IV - Defesa da família como núcleo essencial da sociedade; V- Proteção da infância; VI - Combate ao crime e à impunidade; X - Promoção de governos responsáveis e desburocratizados; XI - promoção da economia livre e garantia do direito à propriedade privada.");

  addText("(O texto completo do Estatuto continua conforme registrado no TSE, abrangendo estrutura partidária, convenções, finanças e disposições gerais).");

  addText("Brasília-DF, 21 de novembro de 2025.");
  addText("LUIZ CARVALHO - Presidente");
  addText("LANDO COBRA - Secretário-Geral OAB-DF 10.937");
  addText("SHEILA BARRIOS - Tesoureira OAB-SP 245.404");

  doc.save("Estatuto-INTELIGENTES.pdf");
};