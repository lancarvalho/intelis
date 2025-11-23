
import { jsPDF } from "jspdf";
import { FormData } from "../types";

const LOGO_URL = 'https://renatorgomes.com/backup/intelis/inteligentes.png';

// Helper to load image
const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

export const generateAffiliationPDF = async (data: FormData) => {
  const doc = new jsPDF();
  const blueColor = "#004e89";

  // Carregar Logo
  let logoImg = null;
  try {
      logoImg = await loadImage(LOGO_URL);
  } catch (e) {
      console.error("Erro ao carregar logo", e);
  }

  // --- Borda Principal ---
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // --- Cabeçalho ---
  if (logoImg) {
      // Logo à esquerda, maior e com proporção correta
      const logoWidth = 65; 
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      // Ajuste vertical para centralizar visualmente com os textos à direita
      doc.addImage(logoImg, 'PNG', 15, 15, logoWidth, logoHeight);
  } else {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(blueColor);
      doc.setFontSize(24);
      doc.text("INTELIGENTES", 15, 30);
  }

  doc.setTextColor(0, 0, 0);
  
  // Textos do Cabeçalho (Alinhados à direita conforme referência)
  const rightMargin = 195;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FICHA DE FILIAÇÃO PARTIDÁRIA", rightMargin, 22, { align: "right" });
  
  doc.setFontSize(12);
  doc.text("INTELIGENTES - INTELiS", rightMargin, 29, { align: "right" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("CNPJ: 12.345.678/0001-90", rightMargin, 36, { align: "right" });

  // Barra Azul separadora (Resolução) - Abaixo da logo e textos
  const resY = 45;
  doc.setFillColor(blueColor);
  doc.rect(10, resY, 190, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold"); 
  doc.text("Resolução-TSE nº 23.571/2018, art. 12, §1º (Lei nº 9.096/95, art 9º, §1º)", 105, resY + 5.5, { align: "center" });

  // --- Dados do Filiado (Grid) ---
  const startY = 60;
  const rowHeight = 16;

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0);
  doc.setLineWidth(0.1);

  // Linha 1: Nome
  doc.rect(10, startY, 190, rowHeight);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blueColor);
  doc.text("Nome do(a) filiado(a)", 12, startY + 5);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold"); // Nome em negrito e maior
  doc.text(data.fullName.toUpperCase(), 12, startY + 12);

  // Linha 2: Data, Título, Zona, Seção
  const row2Y = startY + rowHeight;
  doc.rect(10, row2Y, 190, rowHeight);
  
  // Linhas verticais linha 2
  doc.line(50, row2Y, 50, row2Y + rowHeight); // After Data
  doc.line(110, row2Y, 110, row2Y + rowHeight); // After Titulo (Aumentado)
  doc.line(170, row2Y, 170, row2Y + rowHeight); // After Zona

  // Labels Linha 2
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blueColor);
  doc.text("Data de Filiação", 12, row2Y + 5);
  doc.text("Nº do Título", 52, row2Y + 5);
  doc.text("Zona", 112, row2Y + 5);
  doc.text("Seção", 172, row2Y + 5);

  // Dados Linha 2
  const today = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(today, 12, row2Y + 12);
  doc.text(data.voterTitle || "", 52, row2Y + 12);
  
  // Zona/Cidade
  const zonaText = data.electoralCity ? `${data.electoralCity} - ${data.electoralState}` : "---";
  doc.setFontSize(10); // Ajuste se a cidade for longa
  doc.text(zonaText, 112, row2Y + 12);
  
  doc.setFontSize(11);
  doc.text("---", 172, row2Y + 12); 

  // --- Declaração e Assinatura ---
  const declY = row2Y + rowHeight;
  const declHeight = 65;
  
  // Caixa Grande Assinatura
  doc.rect(10, declY, 150, declHeight); 
  // Caixa Digital
  doc.rect(160, declY, 40, declHeight);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARO ADERIR AO PROGRAMA E ESTATUTO DESTE PARTIDO E", 85, declY + 12, { align: "center" });
  doc.text("NÃO SER FILIADO(A) A NENHUMA OUTRA AGREMIAÇÃO.", 85, declY + 18, { align: "center" });

  // INSERT SIGNATURE HERE - Ajustado para ficar sobre a linha
  if (data.signature) {
    try {
        const sigWidth = 90;
        const sigHeight = 30;
        // Centralizado horizontalmente na caixa esquerda (largura 150, centro 75 -> x=10+75-45=40)
        doc.addImage(data.signature, 'PNG', 40, declY + 25, sigWidth, sigHeight);
    } catch (e) {
        console.error("Error adding signature to PDF", e);
    }
  }

  // Linha assinatura
  doc.setLineWidth(0.2);
  doc.line(35, declY + 55, 135, declY + 55);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Assinatura do(a) filiado(a)", 85, declY + 60, { align: "center" });

  // Digital
  doc.setFontSize(7);
  doc.text("Impressão digital", 180, declY + 30, { align: "center" });
  doc.text("(somente para analfabetos)", 180, declY + 34, { align: "center" });

  // --- Declaração do Recrutador/Validador ---
  const recY = declY + declHeight + 12;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Linhas de preenchimento manual
  doc.text("Eu, ______________________________________________________ , Título de Eleitor ________________", 12, recY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARO, SOB AS PENAS DA LEI, QUE ATESTEI A IDENTIDADE E VONTADE DESTE(A) FILIADO(A).", 105, recY + 8, { align: "center" });

  // --- Instruções (Caixa com Borda Azul) ---
  const instY = recY + 16;
  doc.setDrawColor(blueColor);
  doc.setLineWidth(0.5);
  doc.rect(10, instY, 190, 60);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blueColor);
  doc.text("INSTRUÇÕES E INFORMAÇÕES IMPORTANTES", 105, instY + 10, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  const instructions = [
    "1. Esta ficha oficializa seu vínculo com o INTELIGENTES.",
    "2. A filiação partidária é pré-requisito constitucional para candidaturas.",
    "3. Mantenha seus dados atualizados no site oficial para participar das convenções.",
    "4. O INTELIGENTES defende a vida, a liberdade, a propriedade e a família.",
    "5. Caso já seja filiado a outro partido, esta nova filiação cancelará a anterior automaticamente."
  ];
  
  let iY = instY + 20;
  instructions.forEach((inst) => {
    doc.text(inst, 15, iY);
    iY += 8;
  });

  // --- Aviso Legal (Texto corrido) ---
  const noteY = instY + 66;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  const legalText = "Atenção: A veracidade das informações é de inteira responsabilidade do declarante. A filiação só será efetivada após processamento no sistema Filia/TSE nos prazos legais.";
  doc.text(legalText, 105, noteY, { align: "center", maxWidth: 185 });

  // --- Rodapé (Fundo Cinza Claro) ---
  const footY = 265;
  doc.setFillColor(240, 240, 240); // Cinza bem claro
  doc.setDrawColor(0); 
  doc.setLineWidth(0);
  doc.rect(10, footY, 190, 18, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(blueColor);
  doc.setFont("helvetica", "bold");
  doc.text("Inteligentes - Sede Nacional - Brasília/DF", 105, footY + 7, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Caixa Postal 78460 - CEP 01401-970", 105, footY + 13, { align: "center" });

  doc.save("Ficha-Filiacao-INTELIGENTES.pdf");
};

export const generateStatutePDF = async () => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 5;
  const pageHeight = 280;
  const margin = 20;
  const maxWidth = 170;
  const blueColor = "#004e89";

  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight) {
      doc.addPage();
      y = 20;
    }
  };

  // --- CABEÇALHO CORPORATIVO ---
  // Carregar Logo
  let logoImg = null;
  try {
      logoImg = await loadImage(LOGO_URL);
  } catch (e) {
      console.error("Erro ao carregar logo para estatuto", e);
  }

  if (logoImg) {
    const logoWidth = 50; 
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    // Centralizado
    doc.addImage(logoImg, 'PNG', 105 - (logoWidth/2), y, logoWidth, logoHeight);
    y += logoHeight + 5;
  }

  // Títulos do Cabeçalho
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.setTextColor(blueColor);
  doc.text("INTELIGENTES - INTELiS", 105, y, { align: "center" });
  y += 7;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal"); // Helvetica para dados técnicos fica mais limpo
  doc.text("CNPJ: 12.345.678/0001-90", 105, y, { align: "center" });
  y += 5;

  // Linha divisória corporativa
  doc.setDrawColor(blueColor);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 15; // Espaço após o cabeçalho

  // Retornar para fonte do texto
  doc.setTextColor(0, 0, 0);

  const addTitle = (text: string) => {
    checkPageBreak(15);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(text.toUpperCase(), 105, y, { align: "center" });
    y += 10;
  };

  const addSubtitle = (text: string) => {
    checkPageBreak(10);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(text.toUpperCase(), margin, y);
    y += 6;
  };

  const addArticle = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, maxWidth);
    checkPageBreak(lines.length * lineHeight + 4);
    doc.text(lines, margin, y, { align: "justify", maxWidth: maxWidth });
    y += lines.length * lineHeight + 2;
  };

  // --- CONTEÚDO DO ESTATUTO ---

  addTitle("ESTATUTO PARTIDO INTELIGENTES - INTELiS");

  addSubtitle("O PARTIDO E SEUS OBJETIVOS");
  addArticle("Art. 1º O Inteligentes é partido político com personalidade jurídica de direito privado e sem fins lucrativos, formado com base na legislação vigente e nos preceitos de seu programa e deste estatuto, para atuação em todo território nacional por prazo indeterminado.");
  addArticle("§ 1º Tem sede, foro, domicílio e representação nacional em Brasília, capital da República, exercida conforme orientação estatutária por meio de seu Presidente Nacional e pelos Presidentes Estaduais e Municipais nos assuntos relacionados às respectivas circunscrições.");
  addArticle("§ 2º Utilizará a denominação abreviada Intelis, tendo como símbolo dois aros interligados nas cores verde e amarelo e identificado pelo número 38.");
  
  addArticle("Art. 2º O Inteligentes – Intelis constitui-se como instrumento de realização do processo político, fiel à Constituição da República do Brasil e aos princípios da soberania popular e da representação política, da separação de poderes, do estado democrático de direito, da forma federativa, da limitação do poder, da periodicidade dos mandatos, da moralidade, da transparência, da eficiência, da descentralização, da austeridade, da responsabilidade, da meritocracia e da evolução gradual e natural da sociedade para a permanente proteção da vida, da família, das liberdades individuais, da legítima defesa, da propriedade privada, da livre iniciativa, dos valores culturais e religiosos dos brasileiros, defendendo a garantia da ordem social, moral e jurídica, da segurança pública e da estabilidade política e econômica, a fim de formar cidadãos livres e conscientes e garantir-lhes voz, unindo todos aqueles que estejam sob a bandeira do amor à pátria e contrários a tentativas ideológicas tendentes desvirtuar os valores mais caros aos brasileiros, desestabilizar a sociedade e confrontar a soberania nacional.");
  addArticle("Parágrafo único. O Programa do Inteligentes e seu Código de Ética são partes integrantes do presente Estatuto e deverão ser observados em suas integralidades.");
  
  addArticle("Art. 3º O Inteligentes será considerado extinto, para todos os efeitos legais, mediante deliberação de dois terços da Convenção Nacional.");

  addSubtitle("DA FILIAÇÃO PARTIDÁRIA - PROCEDIMENTOS");
  addArticle("Art. 4º Poderão filiar-se ao Intelis os eleitores em pleno gozo dos seus direitos políticos que se proponham a aceitar, respeitar e difundir fielmente as diretrizes do programa fundador e os preceitos deste Estatuto.");
  addArticle("Art. 5º A filiação partidária no Inteligentes tem caráter permanente e validade em todo o território nacional.");
  addArticle("Art. 6º A filiação será processada segundo as seguintes formalidades:");
  addArticle("I - O proponente deverá preencher formulário disponível no sítio eletrônico oficial do Inteligentes, no qual deverá informar dados pessoais e contato atualizados, além assinalar sua concordância com as diretrizes e preceitos de seu programa e estatuto;");
  addArticle("II - Preenchido o formulário, o eleitor será exclusivamente responsável pela veracidade e transmissão dos dados;");
  addArticle("III - Finalizado o processo de transmissão, o eleitor receberá um recibo da proposta de filiação, que será avaliado pela agremiação;");
  addArticle("IV - Aceita a filiação, o eleitor receberá mensagem na qual constará o número de inscrição;");
  addArticle("V - A eficácia da filiação no tempo retroage à data do pedido de filiação.");

  addArticle("Art. 7º Será observado o seguinte rito de validação da filiação partidária:");
  addArticle("I - Recebida a filiação por meio eletrônico, os dados nela constantes serão exibidos em página própria, durante 3 dias, para consulta e eventual impugnação justificada por parte de filiado ativo, na qual necessariamente deverá constar o número de inscrição do impugnante;");
  addArticle("II - Após exame de validade da impugnação, é assegurado ao impugnado igual prazo para contestação;");
  addArticle("III - Não havendo impugnação ou sendo não sendo ela rejeitada de plano, será expedido o comunicado de aceite como filiado ativo.");
  addArticle("Parágrafo único. É da responsabilidade do filiado informar alterações em seus dados cadastrais no site do Inteligentes, mediante senha própria e exclusiva.");

  addSubtitle("DOS DIREITOS E DEVERES DOS FILIADOS");
  addArticle("Art. 8º Ao filiado é assegurado o direito de participar de todas as atividades partidárias, postular cargos eletivos e da administração interna.");
  addArticle("Parágrafo único. É facultado ao filiado assistir ou participar das reuniões dos órgãos partidários, ainda que sem direito a voto.");
  
  addArticle("Art. 9º São direitos dos filiados:");
  addArticle("I - Participar das Convenções e demais eventos partidários;");
  addArticle("II - Votar e ser votado para os cargos administrativos e para postulação de mandatos eletivos;");
  addArticle("III - Manifestar-se em reuniões partidárias, no limite e pelo tempo definido pelo respectivo Presidente;");
  addArticle("IV - Reclamar, representar ou recorrer de decisões dos órgãos partidários.");

  addArticle("Art. 10. O filiado poderá pertencer simultaneamente aos órgãos direção das diversas esferas da administração partidária.");

  addArticle("Art. 11. São deveres dos filiados ao Intelis:");
  addArticle("I - Participar das convenções municipais;");
  addArticle("II - Participar das campanhas eleitorais, defendendo o programa e os candidatos do Inteligentes;");
  addArticle("III - Contribuir na forma estabelecida por atos resolutivos da Comissão Executiva Nacional;");
  addArticle("IV - Acatar e respeitar os postulados e normas estatutárias.");

  addArticle("Art. 12. O Inteligentes exige de todos seus filiados o compromisso na defesa dos temas abaixo relacionados, sob pena de declaração de infidelidade partidária:");
  addArticle("I - Defesa da democracia, da soberania popular e da representação política;");
  addArticle("II - Respeito aos valores culturais e religiosos e à identidade do povo brasileiro;");
  addArticle("III - Defesa da vida e do direito à legítima defesa, inclusive através da garantia do acesso às armas, como seu corolário necessário;");
  addArticle("IV - Defesa da família como núcleo essencial da sociedade e do direito de os pais educarem seus filhos segundo suas próprias convicções morais e religiosas;");
  addArticle("V - Proteção da infância e de qualquer tentativa ou ideologia que busque a erotização das crianças ou o desvirtuamento de condição natural;");
  addArticle("VI - Combate ao crime, à impunidade e a tentativas de legalização das drogas ilícitas;");
  addArticle("VII - A garantia da ordem social, moral e jurídica, e a defesa da segurança de todos;");
  addArticle("VIII - Promoção da educação voltada ao desenvolvimento humano;");
  addArticle("IX - Fortalecimento das instituições de Estado, com garantia de voz ao povo;");
  addArticle("X - Promoção de governos responsáveis e desburocratizados e da limitação do poder;");
  addArticle("XI - Promoção da economia livre, com garantia do direito à propriedade privada, e respeito às famílias e aos pequenos empreendedores;");
  addArticle("XII - Fortalecimento da segurança pública nacional;");
  addArticle("XIII - Apoio à agricultura e ao agronegócio sustentável;");
  addArticle("XIV - Apoio à industrialização de matérias primas do país.");

  addSubtitle("DA DISCIPLINA PARTIDÁRIA");
  addArticle("Art. 13. A desobediência ao preceituado neste estatuto poderá ensejar a aplicação de medidas disciplinares previstas.");
  addArticle("Art. 14. O cancelamento da filiação somente ocorrerá por morte, perda dos direitos políticos, desfiliação voluntária ou sanção disciplinar, observado o contraditório.");

  addSubtitle("DOS ÓRGÃOS PARTIDÁRIOS");
  addArticle("Art. 15. O Inteligentes é composto segundo a seguinte estrutura: I - Órgãos de deliberação especial: Convenções, Conselho Político Nacional, Diretórios. II - Órgãos de direção: Comissões Executivas, Comissões Provisórias. III - Órgãos de ação: Inteligentes Mulher, Inteligentes Jovem, Inteligentes Inclusiva. IV - Órgãos auxiliares: Conselho Fiscal, Conselho de Ética, Procuradoria Jurídica.");
  
  addArticle("Art. 118. Desde a fundação até a constituição do Diretório Nacional e sua Comissão Executiva Nacional, o Inteligentes será dirigido por Comissão Provisória Nacional.");

  addSubtitle("DISPOSIÇÕES FINAIS");
  addArticle("Art. 122. O Inteligentes terá sede e foro na Capital Federal.");
  addArticle("Art. 124. O presente Estatuto entrará em vigor na data de seu registro no Registro Civil de Pessoas Jurídicas da Capital Federal.");
  
  y += 10;
  doc.text("Brasília-DF, 21 de novembro de 2025.", margin, y);
  y += 10;
  doc.text("LUIZ CARVALHO - Presidente", margin, y);
  y += 6;
  doc.text("LANDO COBRA - Secretário-Geral OAB-DF 10.937", margin, y);
  y += 6;
  doc.text("SHEILA BARRIOS - Tesoureira OAB-SP 245.404", margin, y);

  doc.save("Estatuto-INTELIGENTES.pdf");
};
