
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { type Event } from "@/types";
import { EventPageLayout } from "@/components/event-management/EventPageLayout";
import { EventLoadingState } from "@/components/event-management/EventLoadingState";

const DuplicateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-to-duplicate', id],
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

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const imageInput = document.getElementById("image") as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];
      let imagePath = event?.image || "default-event.jpg";

      if (imageFile) {
        const fileName = `${crypto.randomUUID()}.${imageFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw new Error("Erro ao fazer upload da imagem");
        }

        imagePath = fileName;
      }

      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location || "Santa Hora",
        price: 0, // Default value, as price will be defined in batches
        available_tickets: 0, // Default value, as quantity will be defined in batches
        image: imagePath,
        status: "published" as const
      };

      const { error } = await supabase
        .from("events")
        .insert([eventData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento duplicado com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Erro ao duplicar evento");
      console.error("Erro:", error);
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await createEventMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error("Erro ao duplicar evento");
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
      title="Duplicar Evento" 
      description="Os dados do evento original serão copiados. Você pode modificá-los antes de criar o novo evento."
      onBack={() => navigate(-1)}
    >
      <EventForm
        onSubmit={onSubmit}
        defaultValues={{
          title: `Cópia de ${event.title}`,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
        }}
        isSubmitting={createEventMutation.isPending}
        submitText={createEventMutation.isPending ? "Duplicando evento..." : "Duplicar Evento"}
        imageFieldHelperText="Deixe em branco para usar a mesma imagem do evento original"
      />
    </EventPageLayout>
  );
};

export default DuplicateEvent;
