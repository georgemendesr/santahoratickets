
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Event, Batch } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReferrals } from "@/hooks/useReferrals";

export const useEventDetails = (eventId: string | undefined) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, createProfile } = useProfile(session?.user?.id);
  const { createReferral } = useReferrals(session?.user?.id);
  
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(() => searchParams.get('ref'));
  const [referrer, setReferrer] = useState<{ name: string } | null>(null);

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("ID do evento não fornecido");
      
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar evento:", error);
          throw error;
        }
        
        if (!data) {
          throw new Error("Evento não encontrado");
        }
        
        console.log("Evento encontrado:", data);
        return data as Event;
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        toast.error("Erro ao carregar detalhes do evento");
        return null;
      }
    },
    enabled: !!eventId,
  });

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ["batches", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("ID do evento não fornecido");

      try {
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("event_id", eventId)
          .order("order_number", { ascending: true });

        if (error) {
          console.error("Erro ao buscar lotes:", error);
          throw error;
        }

        console.log("Lotes encontrados:", data);
        return data as Batch[];
      } catch (error) {
        console.error("Erro ao buscar lotes:", error);
        return [];
      }
    },
    enabled: !!eventId,
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const result = await createProfile(cpf, birthDate, phone);
      if (!result) throw new Error("Erro ao criar perfil");
      return result;
    },
    onSuccess: () => {
      setShowProfileDialog(false);
      toast.success("Perfil criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar perfil. Por favor, tente novamente.");
      console.error("Erro:", error);
    },
  });

  const createReferralMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) throw new Error("ID do evento não encontrado");
      const result = await createReferral(eventId);
      if (!result) throw new Error("Erro ao gerar link de indicação");
      return result;
    },
    onSuccess: (data) => {
      setReferralCode(data.code);
      toast.success("Link de indicação gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar link de indicação");
      console.error("Erro:", error);
    },
  });

  return {
    event,
    batches,
    profile,
    referrer,
    referralCode,
    showProfileDialog,
    setShowProfileDialog,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    phone,
    setPhone,
    createProfileMutation,
    createReferralMutation,
    isLoading: isLoadingEvent || isLoadingBatches
  };
};
