
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { type Event } from "@/types";
import { EventPageLayout } from "@/components/event-management/EventPageLayout";
import { EventLoadingState } from "@/components/event-management/EventLoadingState";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const updateData = {
        ...data,
      };

      const { error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar evento");
      console.error("Erro:", error);
    },
  });

  const onSubmit = async (data: EventFormData) => {
    const imageInput = document.getElementById("image") as HTMLInputElement;
    const imageFile = imageInput.files?.[0];

    try {
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(`${Date.now()}-${imageFile.name}`, imageFile);

        if (uploadError) throw uploadError;

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
        imageFieldHelperText="Deixe em branco para manter a imagem atual"
      />
    </EventPageLayout>
  );
};

export default EditEvent;
