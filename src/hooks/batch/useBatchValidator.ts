
import { BatchFormData } from "./types";

export const useBatchValidator = () => {
  const validateForm = (formData: BatchFormData) => {
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

  return { validateForm };
};
