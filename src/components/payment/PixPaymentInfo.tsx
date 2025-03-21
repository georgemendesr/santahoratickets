
interface PixPaymentInfoProps {
  beneficiaryName: string;
  hasPixCode: boolean;
  pixCode?: string | null;
}

export const PixPaymentInfo = ({ beneficiaryName, hasPixCode, pixCode }: PixPaymentInfoProps) => {
  if (!hasPixCode) return null;
  
  // Extrair informações adicionais do código PIX, se disponível
  let merchantName = '';
  let city = '';
  
  if (pixCode) {
    try {
      // Procurar pelo nome do estabelecimento após 5913 (merchant name)
      const merchantMatch = pixCode.match(/5913([^6]+)/);
      merchantName = merchantMatch ? merchantMatch[1] : '';
      
      // Procurar pela cidade após 6010 (merchant city)
      const cityMatch = pixCode.match(/6010([^6]+)/);
      city = cityMatch ? cityMatch[1] : '';
    } catch (error) {
      console.error("Falha ao extrair informações do código PIX", error);
    }
  }
  
  return (
    <>
      <div className="text-sm bg-gray-50 border border-gray-200 rounded-md p-3 w-full space-y-2">
        <div className="flex flex-col">
          <p className="font-medium">{beneficiaryName}</p>
          {merchantName && <p className="text-xs text-gray-600">Empresa: {merchantName}</p>}
          {city && <p className="text-xs text-gray-600">Localização: {city}</p>}
        </div>
        <p className="text-xs text-gray-500 pt-1 border-t border-gray-100">O código expira em 30 minutos</p>
      </div>
      
      <div className="text-sm text-center text-emerald-700 bg-emerald-50 p-3 rounded-md border border-emerald-200 w-full font-medium">
        Use o código PIX acima para realizar o pagamento via copia e cola no seu aplicativo bancário.
      </div>
      
      <div className="text-sm text-center text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-200 w-full">
        <p className="font-medium">Como usar:</p>
        <p className="text-xs mt-1">No seu aplicativo bancário, escolha a opção "PIX Copia e Cola" e cole o código acima. Não tente digitar manualmente o código.</p>
      </div>
    </>
  );
};
