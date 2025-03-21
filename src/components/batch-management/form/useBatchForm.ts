
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFeedback } from "@/context/FeedbackContext";
import { Batch } from "@/types/event.types";

interface BatchFormData {
  title: string;
  price: string;
  totalTickets: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibility: string;
  isVisible: boolean;
  description: string;
  minPurchase: string;
  maxPurchase: string;
  batchGroup: string;
  status?: string;
}

interface UseBatchFormProps {
  eventId: string;
  orderNumber: number;
  batchId?: string | null;
  onSuccess: () => void;
}

export const useBatchForm = ({ eventId, orderNumber, batchId, onSuccess }: UseBatchFormProps) => {
  const [formData, setFormData] = useState<BatchFormData>({
    title: "",
    price: "",
    totalTickets: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    visibility: "public",
    isVisible: true,
    description: "",
    minPurchase: "1",
    maxPurchase: "5",
    batchGroup: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showLoading, hideLoading, showSuccess, showError } = useFeedback();

  // Carregar os dados do lote se estiver editando
  useEffect(() => {
    if (!batchId) return;

    const fetchBatchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .eq('id', batchId)
          .single();

        if (error) throw error;
        
        if (data) {
          const batch = data as Batch;
          
          // Converter data e hora
          const startDate = new Date(batch.start_date);
          const endDate = batch.end_date ? new Date(batch.end_date) : null;

          const formatDateToInputValue = (date: Date) => {
            return date.toISOString().split('T')[0];
          };

          const formatTimeToInputValue = (date: Date) => {
            return date.toISOString().split('T')[1].substring(0, 5);
          };

          setFormData({
            title: batch.title,
            price: batch.price.toString(),
            totalTickets: batch.total_tickets.toString(),
            startDate: formatDateToInputValue(startDate),
            startTime: formatTimeToInputValue(startDate),
            endDate: endDate ? formatDateToInputValue(endDate) : "",
            endTime: endDate ? formatTimeToInputValue(endDate) : "",
            visibility: batch.visibility || "public",
            isVisible: batch.is_visible,
            description: batch.description || "",
            minPurchase: batch.min_purchase.toString(),
            maxPurchase: batch.max_purchase ? batch.max_purchase.toString() : "",
            batchGroup: batch.batch_group || "",
            status: batch.status || "active"
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do lote:', error);
        showError('Não foi possível carregar os dados do lote');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchData();
  }, [batchId, showError]);

  const updateFormField = <K extends keyof BatchFormData>(field: K, value: BatchFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      totalTickets: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      visibility: "public",
      isVisible: true,
      description: "",
      minPurchase: "1",
      maxPurchase: "5",
      batchGroup: ""
    });
  };

  const validateForm = () => {
    if (!formData.title || !formData.price || !formData.totalTickets || !formData.startDate || !formData.startTime) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      throw new Error("O preço deve ser um valor numérico válido");
    }

    if (isNaN(parseInt(formData.totalTickets)) || parseInt(formData.totalTickets) <= 0) {
      throw new Error("A quantidade de ingressos deve ser um número positivo");
    }

    // Validar datas
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    if (isNaN(startDateTime.getTime())) {
      throw new Error("Data de início inválida");
    }

    if (formData.endDate) {
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || "23:59"}`);
      if (isNaN(endDateTime.getTime())) {
        throw new Error("Data de término inválida");
      }

      if (endDateTime <= startDateTime) {
        throw new Error("A data de término deve ser posterior à data de início");
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoading(batchId ? "Atualizando lote..." : "Salvando lote...");

    try {
      // Validações
      validateForm();

      // Se estiver editando, precisamos primeiro obter os dados atuais do lote
      let soldTickets = 0;
      if (batchId) {
        console.log("Buscando dados atuais do lote para atualização");
        const { data: currentBatch, error: fetchError } = await supabase
          .from('batches')
          .select('total_tickets, available_tickets')
          .eq('id', batchId)
          .single();
          
        if (fetchError) {
          console.error("Erro ao buscar dados atuais do lote:", fetchError);
          throw fetchError;
        }
        
        if (currentBatch) {
          // Calcular quantos ingressos foram vendidos
          soldTickets = currentBatch.total_tickets - currentBatch.available_tickets;
          console.log(`Lote tem ${soldTickets} ingressos vendidos de ${currentBatch.total_tickets} total`);
        }
      }

      const newTotalTickets = parseInt(formData.totalTickets);
      
      // Calcular tickets disponíveis
      // Para novos lotes: igual ao total
      // Para edição: total menos vendidos
      const availableTickets = batchId 
        ? Math.max(0, newTotalTickets - soldTickets)
        : newTotalTickets;

      console.log("Novos valores calculados:", {
        newTotalTickets,
        availableTickets,
        soldTickets
      });

      // Determinar status baseado nos tickets disponíveis e data
      let status = "active";
      
      // Verificar se tem ingressos disponíveis
      if (availableTickets <= 0) {
        status = 'sold_out';
      } else {
        // Verificar datas
        const now = new Date();
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
        const endDateTime = formData.endDate 
          ? new Date(`${formData.endDate}T${formData.endTime || "23:59"}:00Z`) 
          : null;
          
        if (now < startDateTime) {
          status = 'upcoming';
        } else if (endDateTime && now > endDateTime) {
          status = 'ended';
        } else {
          status = 'active';
        }
      }

      console.log("Status calculado para o lote:", status);

      const batchData = {
        title: formData.title,
        price: parseFloat(formData.price),
        total_tickets: newTotalTickets,
        available_tickets: availableTickets,
        start_date: `${formData.startDate}T${formData.startTime}:00Z`,
        end_date: formData.endDate ? `${formData.endDate}T${formData.endTime || "23:59"}:00Z` : null,
        visibility: formData.visibility,
        is_visible: formData.isVisible,
        description: formData.description || null,
        min_purchase: parseInt(formData.minPurchase),
        max_purchase: formData.maxPurchase ? parseInt(formData.maxPurchase) : null,
        batch_group: formData.batchGroup || null,
        event_id: eventId,
        order_number: batchId ? undefined : orderNumber, // Não atualiza order_number na edição
        status: status
      };

      console.log(batchId ? "Atualizando lote:" : "Enviando dados do lote:", batchData);

      let operation;
      if (batchId) {
        // Atualizando lote existente
        operation = supabase
          .from('batches')
          .update(batchData)
          .eq('id', batchId)
          .select();
      } else {
        // Criando novo lote
        operation = supabase
          .from('batches')
          .insert([batchData])
          .select();
      }

      const { data, error } = await operation;

      if (error) {
        console.error('Erro ao salvar lote:', error);
        throw new Error(`Erro ao salvar lote: ${error.message}`);
      }

      console.log("Lote salvo com sucesso:", data);
      showSuccess(batchId ? "Lote atualizado com sucesso!" : "Lote criado com sucesso!");
      
      // Limpar formulário
      resetForm();
      
      // Notificar o componente pai do sucesso
      onSuccess();
      
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      showError(error instanceof Error ? error.message : "Erro ao salvar lote");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return {
    formData,
    isSubmitting,
    isLoading,
    updateFormField,
    handleSubmit,
    isEditing: !!batchId
  };
};
