
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatusInfo {
  title: string;
  description: string;
  icon: JSX.Element;
  buttonText: string;
  buttonAction: () => void;
  alert: {
    description: string;
    className: string;
  };
}

interface PaymentStatusInfoProps {
  status: string | null;
  eventId: string | undefined;
  navigate: (path: string) => void;
  errorMessage?: string | null;
}

export const getStatusInfo = ({ status, eventId, navigate, errorMessage }: PaymentStatusInfoProps): StatusInfo => {
  switch (status) {
    case "approved":
      return {
        title: "Pagamento Aprovado!",
        description: "Seu voucher foi gerado com sucesso.",
        icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
        buttonText: "Ver Meus Vouchers",
        buttonAction: () => navigate("/tickets"),
        alert: {
          description: "Você receberá um e-mail com seu QR Code em breve.",
          className: "bg-green-50 border-green-200 text-green-800"
        }
      };
    case "pending":
      return {
        title: "Pagamento em Processamento",
        description: "Aguardando confirmação do pagamento.",
        icon: <Clock className="w-12 h-12 text-yellow-500" />,
        buttonText: "Voltar para o Evento",
        buttonAction: () => navigate(`/event/${eventId}`),
        alert: {
          description: "Assim que o pagamento for confirmado, seu voucher será gerado automaticamente.",
          className: "bg-yellow-50 border-yellow-200 text-yellow-800"
        }
      };
    case "rejected":
      return {
        title: "Pagamento não Aprovado",
        description: "Houve um problema com seu pagamento.",
        icon: <AlertCircle className="w-12 h-12 text-red-500" />,
        buttonText: "Tentar Novamente",
        buttonAction: () => navigate(`/event/${eventId}`),
        alert: {
          description: "Por favor, verifique os dados e tente novamente.",
          className: "bg-red-50 border-red-200 text-red-800"
        }
      };
    case "error":
      return {
        title: "Erro ao Gerar PIX",
        description: "Não foi possível gerar o código PIX.",
        icon: <AlertCircle className="w-12 h-12 text-red-500" />,
        buttonText: "Tentar Novamente",
        buttonAction: () => navigate(`/event/${eventId}`),
        alert: {
          description: errorMessage || "Ocorreu um erro inesperado. Por favor, tente novamente.",
          className: "bg-red-50 border-red-200 text-red-800"
        }
      };
    default:
      return {
        title: "Status Desconhecido",
        description: "Não foi possível determinar o status do pagamento.",
        icon: <AlertCircle className="w-12 h-12 text-gray-500" />,
        buttonText: "Voltar para Home",
        buttonAction: () => navigate("/"),
        alert: {
          description: "Se você tiver dúvidas, entre em contato com nosso suporte.",
          className: "bg-gray-50 border-gray-200 text-gray-800"
        }
      };
  }
};

export const PaymentStatusInfo = ({ status, eventId, navigate, errorMessage }: PaymentStatusInfoProps) => {
  const statusInfo = getStatusInfo({ status, eventId, navigate, errorMessage });

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        {statusInfo.icon}
        <h2 className="text-center text-2xl font-semibold">{statusInfo.title}</h2>
      </div>
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">
          {statusInfo.description}
        </p>
        <Alert className={statusInfo.alert.className}>
          <AlertDescription>
            {statusInfo.alert.description}
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
};
