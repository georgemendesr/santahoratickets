
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventForm, type EventFormData } from "@/components/EventForm";

const CreateEvent = () => {
  const navigate = useNavigate();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const imageInput = document.getElementById("image") as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];
      let imagePath = "default-event.jpg"; // Imagem padrão se nenhuma for enviada

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
        location: data.location,
        price: parseFloat(data.price),
        available_tickets: parseInt(data.available_tickets),
        image: imagePath,
        status: "published" as const
      };

      const { error } = await supabase
        .from("events")
        .insert([eventData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Erro ao criar evento");
      console.error("Erro:", error);
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await createEventMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error("Erro ao criar evento");
    }
  };

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
          <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <EventForm
            onSubmit={onSubmit}
            isSubmitting={createEventMutation.isPending}
            submitText={createEventMutation.isPending ? "Criando evento..." : "Criar Evento"}
            showImageField={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
