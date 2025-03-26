
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Event, Batch } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReferrals } from "@/hooks/useReferrals";

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
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Buscar detalhes do evento com melhor tratamento de erros
  const { data: event, isLoading: isLoadingEvent, error: eventError, refetch: refetchEvent } = useQuery({
    queryKey: ["event", eventId, retryAttempt],
    queryFn: async () => {
      if (!eventId) {
        console.error("ID do evento não fornecido");
        throw new Error("ID do evento não fornecido");
      }
      
      try {
        console.log(`[${new Date().toISOString()}] Buscando evento com ID:`, eventId, "- Tentativa:", retryAttempt + 1);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle();

        if (error) {
          console.error(`[${new Date().toISOString()}] Erro ao buscar evento:`, error);
          throw error;
        }
        
        if (!data) {
          console.error(`[${new Date().toISOString()}] Evento não encontrado com ID:`, eventId);
          throw new Error("Evento não encontrado");
        }
        
        console.log(`[${new Date().toISOString()}] Evento encontrado com sucesso:`, data);
        return data as Event;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Exceção ao buscar evento:`, error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    staleTime: 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });

  // Buscar lotes com melhor tratamento de erros
  const { data: batches, isLoading: isLoadingBatches, error: batchesError, refetch: refetchBatches } = useQuery({
    queryKey: ["batches", eventId, retryAttempt],
    queryFn: async () => {
      if (!eventId) {
        console.error("ID do evento não fornecido para buscar lotes");
        throw new Error("ID do evento não fornecido");
      }

      try {
        console.log(`[${new Date().toISOString()}] Buscando lotes para o evento:`, eventId);
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("event_id", eventId)
          .eq("is_visible", true)
          .order("order_number", { ascending: true });

        if (error) {
          console.error(`[${new Date().toISOString()}] Erro ao buscar lotes:`, error);
          throw error;
        }

        console.log(`[${new Date().toISOString()}] Lotes encontrados:`, data?.length || 0);
        return data as Batch[];
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Exceção ao buscar lotes:`, error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    staleTime: 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
    enabled: !!eventId && !!event,
  });

  // Buscar informações de referência se houver código ref
  useQuery({
    queryKey: ["referrer", referralCode, retryAttempt],
    queryFn: async () => {
      if (!referralCode) return null;
      
      try {
        console.log(`[${new Date().toISOString()}] Buscando referência para código:`, referralCode);
        const { data, error } = await supabase
          .from("referrals")
          .select("referrer_id")
          .eq("code", referralCode)
          .maybeSingle();
          
        if (error || !data) {
          console.log(`[${new Date().toISOString()}] Nenhuma referência encontrada para código:`, referralCode);
          return null;
        }
        
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("name")
          .eq("id", data.referrer_id)
          .maybeSingle();
          
        if (userError || !userData) {
          console.log(`[${new Date().toISOString()}] Nenhum usuário encontrado para referrer_id:`, data.referrer_id);
          return null;
        }
        
        console.log(`[${new Date().toISOString()}] Referência encontrada, nome:`, userData.name);
        setReferrer({ name: userData.name });
        return userData;
      } catch (e) {
        console.error(`[${new Date().toISOString()}] Erro ao buscar referência:`, e);
        return null;
      }
    },
    retry: 1,
    enabled: !!referralCode,
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      console.log(`[${new Date().toISOString()}] Criando perfil com CPF:`, cpf, "Data de nascimento:", birthDate, "Telefone:", phone);
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
      console.error(`[${new Date().toISOString()}] Erro ao criar perfil:`, error);
    },
  });

  const createReferralMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) throw new Error("ID do evento não encontrado");
      console.log(`[${new Date().toISOString()}] Gerando link de indicação para evento:`, eventId);
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
      console.error(`[${new Date().toISOString()}] Erro ao gerar link de indicação:`, error);
    },
  });

  // Função para forçar o recarregamento dos dados com incremento do contador de tentativas
  const refreshData = () => {
    console.log(`[${new Date().toISOString()}] Forçando recarregamento dos dados, nova tentativa: ${retryAttempt + 1}`);
    setRetryAttempt(prev => prev + 1);
    
    // Também podemos chamar diretamente as funções de refetch para garantir
    refetchEvent();
    refetchBatches();
    
    toast.info("Recarregando informações do evento...");
  };

  // Verificar se temos erro de evento mas não de lotes, ou vice-versa
  useEffect(() => {
    if ((eventError && !batchesError) || (!eventError && batchesError)) {
      console.log(`[${new Date().toISOString()}] Detectado erro parcial: Evento=${!!eventError}, Lotes=${!!batchesError}`);
    }
  }, [eventError, batchesError]);

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
    hasError: !!eventError || !!batchesError,
    retryAttempt
  };
};
