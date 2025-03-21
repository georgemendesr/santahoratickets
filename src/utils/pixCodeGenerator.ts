
/**
 * Gera um código PIX válido no padrão BR Code a partir de informações básicas
 * @param {Object} data - Dados para gerar o código PIX
 * @returns {string} Código PIX válido no formato BR Code
 */
export function generateValidPixCode(data: { rawCode: string, amount?: number }) {
  // Extrair dados do código PIX
  try {
    const rawCode = data.rawCode || '';
    
    // Extrair informações importantes usando regex
    const pixKey = extractValue(rawCode, /br\.gov\.bcb\.pix01(\d{2})([^\d]+)/);
    const name = extractValue(rawCode, /0214([^5]+)/);
    const amount = extractValue(rawCode, /5204\d{4}53\d{2}54(\d{2})([^5]+)/);
    const description = extractValue(rawCode, /59(\d{2})([^6]+)/);
    const merchantName = extractValue(rawCode, /60(\d{2})([^6]+)/);
    const txId = extractValue(rawCode, /62(\d{2})([^6]+)/);
    
    // Construir manualmente um código PIX válido
    // Este é um código simplificado no padrão BR Code
    const payload = [
      "00020126",                               // Payload Format Indicator
      `0014br.gov.bcb.pix${formatField(pixKey)}`,  // PIX Key
      `0214${formatField(name)}`,               // Beneficiary Name
      "52040000",                               // Category
      "5303986",                                // Currency (986 = BRL)
      `54${formatAmount(amount)}`,              // Amount
      "5802BR",                                 // Country Code
      `59${formatField(description)}`,          // Description
      `60${formatField(merchantName)}`,         // Merchant Name
      `62${formatField(txId)}`,                 // Transaction ID
      "6304"                                    // CRC16 (será calculado depois)
    ].join("");
    
    // Adicionar CRC16 (checksum)
    const crc16 = calculateCRC16(payload);
    const fullCode = `${payload}${crc16.toUpperCase()}`;
    
    return fullCode;
  } catch (error) {
    console.error("Erro ao gerar código PIX válido:", error);
    return data.rawCode; // Retorna o original em caso de erro
  }
}

// Função auxiliar para extrair valores com regex
function extractValue(rawCode: string, pattern: RegExp): string {
  const match = rawCode.match(pattern);
  if (match && match.length > 1) {
    // Se o match tem um grupo de dígitos para comprimento seguido pelo valor
    if (match.length > 2) {
      return match[2]; // Retorna o valor
    }
    return match[1]; // Retorna o valor único
  }
  return '';
}

// Formata um campo adicionando o comprimento
function formatField(value: string): string {
  if (!value) return '';
  const length = value.length.toString().padStart(2, '0');
  return `${length}${value}`;
}

// Formata um valor monetário
function formatAmount(amount: string): string {
  if (!amount) return '00';
  // Remove caracteres não-numéricos e converte para número
  let numericValue = amount.replace(/[^\d\.]/g, '');
  // Se tiver ponto decimal, mantém até 2 casas decimais
  if (numericValue.includes('.')) {
    const parts = numericValue.split('.');
    numericValue = parts[0] + '.' + parts[1].substring(0, 2).padEnd(2, '0');
  }
  
  const length = numericValue.length.toString().padStart(2, '0');
  return `${length}${numericValue}`;
}

// Calcula o CRC16 (checksum) para o código PIX
function calculateCRC16(payload: string): string {
  // Polinômio para PIX: 0x1021 (CRC-16/CCITT-FALSE)
  const polynomial = 0x1021;
  let crc = 0xFFFF; // Valor inicial
  
  // Adicionar '6304' ao payload para calcular CRC
  const buffer = payload + "6304";
  
  for (let i = 0; i < buffer.length; i++) {
    crc ^= (buffer.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  
  // Converter para hexadecimal de 4 dígitos
  return crc.toString(16).padStart(4, '0').toUpperCase();
}

// Extrai o nome do beneficiário do código PIX
export function extractNameFromCode(code: string | null): string {
  if (!code) return '';
  
  try {
    // Tentar extrair o nome do beneficiário (campo 59 - merchant name)
    const merchantNameMatch = code.match(/5913([^6]+)/);
    if (merchantNameMatch && merchantNameMatch[1]) {
      return merchantNameMatch[1].trim();
    }
    
    // Alternativa: tentar o campo 60 (merchant name em outro formato)
    const altMerchantMatch = code.match(/60(\d{2})([^6]+)/);
    if (altMerchantMatch && altMerchantMatch[2]) {
      return altMerchantMatch[2].trim();
    }
    
    // Última alternativa: tentar o campo 02 (beneficiary name)
    const beneficiaryMatch = code.match(/0214([^5]+)/);
    if (beneficiaryMatch && beneficiaryMatch[1]) {
      return beneficiaryMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error("Erro ao extrair nome do código PIX:", error);
    return '';
  }
}
