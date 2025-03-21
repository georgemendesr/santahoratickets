
import { useFeedback } from "@/context/FeedbackContext";
import { useBatchFormState } from "./useBatchFormState";
import { useBatchValidator } from "./useBatchValidator";
import { useBatchFetch } from "./useBatchFetch";
import { useBatchSave } from "./useBatchSave";
import { UseBatchFormProps } from "./types";

export const useBatchForm = ({ eventId, orderNumber, batchId, onSuccess }: UseBatchFormProps) => {
  const { 
    formData, 
    isSubmitting, 
    isLoading, 
    updateFormField, 
    resetForm, 
    setFormData, 
    setIsSubmitting, 
    setIsLoading 
  } = useBatchFormState();
  
  const { validateForm } = useBatchValidator();
  const { prepareBatchData, saveBatch } = useBatchSave();
  const { showLoading, hideLoading, showSuccess, showError } = useFeedback();

  // Carregar os dados do lote se estiver editando
  useBatchFetch(batchId, setFormData, setIsLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoading(batchId ? "Atualizando lote..." : "Salvando lote...");

    try {
      // Validações
      validateForm(formData);

      // Preparar dados do lote
      const batchData = await prepareBatchData(formData, eventId, orderNumber, batchId);

      // Salvar lote
      await saveBatch(batchData, batchId);

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
