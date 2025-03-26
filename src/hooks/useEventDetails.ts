
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Event, Batch } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReferrals } from "@/hooks/useReferrals";
import { QueryBuilder } from "@/utils/queryBuilder";

export const useEventDetails = (eventId: string | undefined) => {
  const queryClient = useQueryClient();
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

  // Buscar detalhes do evento com melhor tratamento de erros
  const { data: event, isLoading: isLoadingEvent, error: eventError, refetch: refetchEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("ID do evento não fornecido");
      
      try {
        console.log("Buscando evento com ID:", eventId);
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
          console.error("Evento não encontrado com ID:", eventId);
          throw new Error("Evento não encontrado");
        }
        
        console.log("Evento encontrado:", data);
        return data as Event;
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    enabled: !!eventId,
  });

  // Buscar lotes com melhor tratamento de erros
  const { data: batches, isLoading: isLoadingBatches, error: batchesError, refetch: refetchBatches } = useQuery({
    queryKey: ["batches", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("ID do evento não fornecido");

      try {
        console.log("Buscando lotes para o evento:", eventId);
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("event_id", eventId)
          .eq("is_visible", true)
          .order("order_number", { ascending: true });

        if (error) {
          console.error("Erro ao buscar lotes:", error);
          throw error;
        }

        console.log("Lotes encontrados:", data?.length || 0);
        return data as Batch[];
      } catch (error) {
        console.error("Erro ao buscar lotes:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    enabled: !!eventId && !!event,
  });

  // Buscar informações de referência se houver código ref
  useQuery({
    queryKey: ["referrer", referralCode],
    queryFn: async () => {
      if (!referralCode) return null;
      
      try {
        const { data, error } = await supabase
          .from("referrals")
          .select("referrer_id")
          .eq("code", referralCode)
          .maybeSingle();
          
        if (error || !data) return null;
        
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("name")
          .eq("id", data.referrer_id)
          .maybeSingle();
          
        if (userError || !userData) return null;
        
        setReferrer({ name: userData.name });
        return userData;
      } catch (e) {
        console.error("Erro ao buscar referência:", e);
        return null;
      }
    },
    enabled: !!referralCode,
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error("Erro ao criar perfil. Por favor, tente novamente.");
      console.error("Erro ao criar perfil:", error);
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
      console.error("Erro ao gerar link de indicação:", error);
    },
  });

  // Função para recarregar os dados
  const refreshData = () => {
    console.log("Recarregando dados do evento e lotes...");
    refetchEvent();
    refetchBatches();
    toast.info("Recarregando informações do evento...");
  };

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
    refreshData,
    isLoading: isLoadingEvent || isLoadingBatches,
    hasError: !!eventError || !!batchesError
  };
};
