import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { type Event } from "@/types";

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
          <h1 className="text-3xl font-bold">Editar Evento</h1>
        </div>

        <div className="max-w-2xl mx-auto">
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
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
