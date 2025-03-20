
import { BatchFormHeader } from "./form/BatchFormHeader";
import { DateTimeFields } from "./form/DateTimeFields";
import { VisibilityOptions } from "./form/VisibilityOptions";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";
import { useBatchForm } from "./form/useBatchForm";

interface BatchFormProps {
  eventId: string;
  orderNumber: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BatchForm = ({ eventId, orderNumber, onCancel, onSuccess }: BatchFormProps) => {
  const { formData, isSubmitting, updateFormField, handleSubmit } = useBatchForm({
    eventId,
    orderNumber,
    onSuccess
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-5">
        <BatchFormHeader 
          title={formData.title}
          setTitle={(value) => updateFormField('title', value)}
          price={formData.price}
          setPrice={(value) => updateFormField('price', value)}
          totalTickets={formData.totalTickets}
          setTotalTickets={(value) => updateFormField('totalTickets', value)}
        />

        <DateTimeFields 
          startDate={formData.startDate}
          setStartDate={(value) => updateFormField('startDate', value)}
          startTime={formData.startTime}
          setStartTime={(value) => updateFormField('startTime', value)}
          endDate={formData.endDate}
          setEndDate={(value) => updateFormField('endDate', value)}
          endTime={formData.endTime}
          setEndTime={(value) => updateFormField('endTime', value)}
        />

        <VisibilityOptions 
          visibility={formData.visibility}
          setVisibility={(value) => updateFormField('visibility', value)}
          isVisible={formData.isVisible}
          setIsVisible={(value) => updateFormField('isVisible', value)}
        />

        <AdditionalFields 
          description={formData.description}
          setDescription={(value) => updateFormField('description', value)}
          minPurchase={formData.minPurchase}
          setMinPurchase={(value) => updateFormField('minPurchase', value)}
          maxPurchase={formData.maxPurchase}
          setMaxPurchase={(value) => updateFormField('maxPurchase', value)}
          batchGroup={formData.batchGroup}
          setBatchGroup={(value) => updateFormField('batchGroup', value)}
        />
      </div>

      <FormActions 
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel="Salvar Lote"
        cancelLabel="Cancelar"
      />
    </form>
  );
};
