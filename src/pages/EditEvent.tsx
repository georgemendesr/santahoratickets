
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { type Event } from "@/types";
import { EventPageLayout } from "@/components/event-management/EventPageLayout";
import { EventLoadingState } from "@/components/event-management/EventLoadingState";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData & { image?: string }) => {
      console.log("Atualizando evento com dados:", data);
      
      const updateData = {
        ...data,
      };

      const { data: updatedEvent, error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Erro ao atualizar evento:", error);
        throw error;
      }
      
      console.log("Evento atualizado com sucesso:", updatedEvent);
      return updatedEvent;
    },
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      // Invalidar a consulta para forçar o recarregamento dos dados
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      navigate("/admin/eventos");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar evento");
      console.error("Erro:", error);
    },
  });

  const onSubmit = async (data: EventFormData) => {
    const imageInput = document.getElementById("image") as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    try {
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw new Error("Erro ao fazer upload da imagem");
        }

        const { data: { publicUrl } } = supabase.storage
          .from("event-images")
          .getPublicUrl(uploadData.path);

        await updateEventMutation.mutateAsync({
          ...data,
          image: publicUrl,
        });
      } else {
        await updateEventMutation.mutateAsync(data);
      }
    } catch (error) {
      toast.error("Erro ao atualizar evento");
      console.error("Erro:", error);
    }
  };

  if (isLoading) {
    return <EventLoadingState />;
  }

  if (!event) {
    return <EventLoadingState message="Evento não encontrado" />;
  }

  return (
    <EventPageLayout 
      title="Editar Evento" 
      onBack={() => navigate(-1)}
    >
      <EventForm
        onSubmit={onSubmit}
        defaultValues={{
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
        }}
        isSubmitting={updateEventMutation.isPending}
        submitText={updateEventMutation.isPending ? "Atualizando evento..." : "Atualizar Evento"}
        showImageField={true}
        imageFieldHelperText="Deixe em branco para manter a imagem atual"
      />
    </EventPageLayout>
  );
};

export default EditEvent;
