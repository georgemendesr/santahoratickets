
import { BatchFormHeader } from "./form/BatchFormHeader";
import { DateTimeFields } from "./form/DateTimeFields";
import { VisibilityOptions } from "./form/VisibilityOptions";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";
import { useBatchForm } from "./form/useBatchForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BatchStatusBadge } from "./BatchStatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface BatchFormProps {
  eventId: string;
  orderNumber: number;
  batchId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BatchForm = ({ eventId, orderNumber, batchId, onCancel, onSuccess }: BatchFormProps) => {
  const { formData, isSubmitting, isLoading, updateFormField, handleSubmit, isEditing } = useBatchForm({
    eventId,
    orderNumber,
    batchId,
    onSuccess
  });

  // Mostrar esqueleto enquanto os dados são carregados na edição
  if (batchId && isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{isEditing ? 'Editar Lote' : 'Novo Lote'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Modifique as informações do lote existente' 
                : 'Preencha os dados para criar um novo lote de ingressos'}
            </CardDescription>
          </div>
          {isEditing && formData.startDate && (
            <BatchStatusBadge 
              status={formData.status || 'active'}
              isVisible={formData.isVisible}
              startDate={formData.startDate}
              endDate={formData.endDate}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <BatchFormHeader 
              title={formData.title}
              setTitle={(value) => updateFormField('title', value)}
              price={formData.price}
              setPrice={(value) => updateFormField('price', value)}
              totalTickets={formData.totalTickets}
              setTotalTickets={(value) => updateFormField('totalTickets', value)}
              isEditing={isEditing}
            />

            <Separator />

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

            <Separator />

            <VisibilityOptions 
              visibility={formData.visibility}
              setVisibility={(value) => updateFormField('visibility', value)}
              isVisible={formData.isVisible}
              setIsVisible={(value) => updateFormField('isVisible', value)}
            />

            <Separator />

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

          {isEditing && (
            <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Edição de lote</AlertTitle>
              <AlertDescription>
                Algumas propriedades como quantidade total de ingressos não podem ser alteradas 
                após a criação do lote por questões de integridade.
              </AlertDescription>
            </Alert>
          )}

          <FormActions 
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel={batchId ? "Atualizar Lote" : "Salvar Lote"}
            cancelLabel="Cancelar"
          />
        </form>
      </CardContent>
    </Card>
  );
};
