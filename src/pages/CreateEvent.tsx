
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventForm, type EventFormData } from "@/components/EventForm";
import { uploadEventImage } from "@/utils/eventImageUpload";
import { useAuth } from "@/hooks/useAuth";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      try {
        if (!session?.user) {
          throw new Error("Você precisa estar autenticado para criar um evento");
        }

        // Upload da imagem
        const imageInput = document.getElementById("image") as HTMLInputElement;
        const imageFile = imageInput?.files?.[0];
        let imageUrl = null;

        if (imageFile) {
          try {
            imageUrl = await uploadEventImage(imageFile);
            console.log("Imagem enviada com sucesso:", imageUrl);
          } catch (error) {
            console.error("Erro no upload da imagem:", error);
            toast.error("Erro ao fazer upload da imagem");
            throw error;
          }
        }

        // Dados do evento
        const eventData = {
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location || "Santa Hora",
          price: 0, // Valor padrão, já que o preço será definido nos lotes
          available_tickets: 0, // Valor padrão, já que a quantidade será definida nos lotes
          image: imageUrl || "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png", // Imagem padrão se nenhuma for enviada
          status: "published" as const
        };

        console.log("Criando evento:", eventData);

        const { error, data: newEvent } = await supabase
          .from("events")
          .insert([eventData])
          .select();

        if (error) {
          console.error("Erro ao inserir evento:", error);
          throw new Error(`Erro ao inserir evento: ${error.message}`);
        }
        
        console.log("Evento criado com sucesso:", newEvent);
        return newEvent[0];
      } catch (error) {
        console.error("Erro na criação do evento:", error);
        throw error;
      }
    },
    onSuccess: (event) => {
      toast.success("Evento criado com sucesso!");
      // Redirecionar para a página inicial após o sucesso
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar evento: ${error.message}`);
      console.error("Erro na mutação:", error);
    },
  });

  const onSubmit = async (data: EventFormData) => {
    createEventMutation.mutate(data);
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
          <p className="text-muted-foreground mt-2">
            Preencha os detalhes do evento semanal do Santa Hora.
          </p>
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
