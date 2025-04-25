
import { useState } from "react";
import { BatchFormData } from "./types";

export const useBatchFormState = () => {
  // Valor inicial para o formulário
  const initialFormData: BatchFormData = {
    title: "",
    price: "",
    totalTickets: "",
    startDate: new Date().toISOString().split("T")[0], // Data atual como padrão
    startTime: "12:00", // Meio-dia como horário padrão
    endDate: "",
    endTime: "",
    visibility: "public",
    isVisible: true,
    description: "",
    minPurchase: "1",
    maxPurchase: "5",
    batchGroup: ""
  };

  const [formData, setFormData] = useState<BatchFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormField = <K extends keyof BatchFormData>(field: K, value: BatchFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    isSubmitting,
    isLoading,
    updateFormField,
    resetForm,
    setFormData,
    setIsSubmitting,
    setIsLoading
  };
};
