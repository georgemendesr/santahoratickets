
import { BatchFormHeader } from "./form/BatchFormHeader";
import { DateTimeFields } from "./form/DateTimeFields";
import { VisibilityOptions } from "./form/VisibilityOptions";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";
import { useBatchForm } from "./form/useBatchForm";
import { Skeleton } from "@/components/ui/skeleton";

interface BatchFormProps {
  eventId: string;
  orderNumber: number;
  batchId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BatchForm = ({ eventId, orderNumber, batchId, onCancel, onSuccess }: BatchFormProps) => {
  const { formData, isSubmitting, isLoading, updateFormField, handleSubmit } = useBatchForm({
    eventId,
    orderNumber,
    batchId,
    onSuccess
  });

  // Mostrar esqueleto enquanto os dados são carregados na edição
  if (batchId && isLoading) {
    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

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
        submitLabel={batchId ? "Atualizar Lote" : "Salvar Lote"}
        cancelLabel="Cancelar"
      />
    </form>
  );
};
