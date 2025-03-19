import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { type Event } from "@/types";

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
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          <p>Evento não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Duplicar Evento</h1>
          <p className="text-muted-foreground mt-2">
            Os dados do evento original serão copiados. Você pode modificá-los antes de criar o novo evento.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
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
        </div>
      </div>
    </div>
  );
};

export default DuplicateEvent;
