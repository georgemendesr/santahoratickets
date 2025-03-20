
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFeedback } from "@/context/FeedbackContext";

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
}

interface UseBatchFormProps {
  eventId: string;
  orderNumber: number;
  onSuccess: () => void;
}

export const useBatchForm = ({ eventId, orderNumber, onSuccess }: UseBatchFormProps) => {
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
  const { showLoading, hideLoading, showSuccess, showError } = useFeedback();

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
    showLoading("Salvando lote...");

    try {
      // Validações
      validateForm();

      const batchData = {
        title: formData.title,
        price: parseFloat(formData.price),
        total_tickets: parseInt(formData.totalTickets),
        available_tickets: parseInt(formData.totalTickets),
        start_date: `${formData.startDate}T${formData.startTime}:00Z`,
        end_date: formData.endDate ? `${formData.endDate}T${formData.endTime || "23:59"}:00Z` : null,
        visibility: formData.visibility,
        is_visible: formData.isVisible,
        description: formData.description || null,
        min_purchase: parseInt(formData.minPurchase),
        max_purchase: formData.maxPurchase ? parseInt(formData.maxPurchase) : null,
        batch_group: formData.batchGroup || null,
        event_id: eventId,
        order_number: orderNumber,
        status: 'active'
      };

      console.log("Enviando dados do lote:", batchData);

      const { data, error } = await supabase
        .from('batches')
        .insert([batchData])
        .select();

      if (error) {
        console.error('Erro ao criar lote:', error);
        throw new Error(`Erro ao criar lote: ${error.message}`);
      }

      console.log("Lote criado com sucesso:", data);
      showSuccess("Lote criado com sucesso!");
      
      // Limpar formulário
      resetForm();
      
      // Notificar o componente pai do sucesso
      onSuccess();
      
    } catch (error) {
      console.error('Erro ao criar lote:', error);
      showError(error instanceof Error ? error.message : "Erro ao criar lote");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return {
    formData,
    isSubmitting,
    updateFormField,
    handleSubmit
  };
};
