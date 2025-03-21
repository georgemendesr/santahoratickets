
interface PixPaymentInfoProps {
  beneficiaryName: string;
  hasPixCode: boolean;
}

export const PixPaymentInfo = ({ beneficiaryName, hasPixCode }: PixPaymentInfoProps) => {
  if (!hasPixCode) return null;
  
  return (
    <>
      <div className="text-sm bg-gray-50 border border-gray-200 rounded-md p-3 w-full">
        <p className="font-medium mb-1">{beneficiaryName}</p>
        <p className="text-xs text-gray-500">O código expira em 30 minutos</p>
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
