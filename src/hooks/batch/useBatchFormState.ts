
import { useState } from "react";
import { BatchFormData } from "./types";

export const useBatchFormState = () => {
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
