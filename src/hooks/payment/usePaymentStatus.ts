
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePaymentStatusProps {
  preferenceId: string | undefined | null;
  payment_id: string | null;
  reference: string | null;
  initialStatus: string | null;
  currentStatus: string | null;
  setCurrentStatus: (status: string) => void;
}

export const usePaymentStatus = ({
  preferenceId,
  payment_id,
  reference,
  initialStatus,
  currentStatus,
  setCurrentStatus
}: UsePaymentStatusProps) => {
  const [isPolling, setIsPolling] = useState(true);

  const handleStatusChange = useCallback((newStatus: string) => {
    console.log("Mudança de status detectada:", newStatus, "Status atual:", currentStatus);
    
    if (newStatus === currentStatus) {
      console.log("Status já está atualizado, ignorando");
      return;
    }

    setCurrentStatus(newStatus);
    
    if (newStatus === "approved") {
      toast.success("Pagamento aprovado!");
      setIsPolling(false);
      window.location.href = `/payment-status?status=approved&payment_id=${payment_id}&external_reference=${reference}`;
    } else if (newStatus === "rejected") {
      toast.error("Pagamento rejeitado");
      setIsPolling(false);
      window.location.href = `/payment-status?status=rejected&payment_id=${payment_id}&external_reference=${reference}`;
    }
  }, [payment_id, reference, currentStatus, setCurrentStatus]);

  useEffect(() => {
    if (!preferenceId || !isPolling) return;

    // Configurar inscrição em tempo real para o status do pagamento
    console.log("Configurando inscrição em tempo real para:", preferenceId);
    
    const channel = supabase
      .channel('payment_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_preferences',
          filter: `id=eq.${preferenceId}`
        },
        (payload) => {
          console.log("Atualização em tempo real recebida:", payload);
          const newStatus = payload.new.status;
          
          if (newStatus !== "pending") {
            handleStatusChange(newStatus);
          }
        }
      )
      .subscribe((status) => {
        console.log("Status da inscrição:", status);
      });

    return () => {
      console.log("Limpando inscrição de tempo real");
      supabase.removeChannel(channel);
    };
  }, [preferenceId, handleStatusChange, isPolling]);

  useEffect(() => {
    // Se já temos um status inicial diferente de pending, aplicar a lógica
    if (initialStatus && initialStatus !== "pending") {
      handleStatusChange(initialStatus);
    }
  }, [initialStatus, handleStatusChange]);

  return {
    isPolling,
    setIsPolling
  };
};
