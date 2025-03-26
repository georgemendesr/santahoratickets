import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Event, Batch } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReferrals } from "@/hooks/useReferrals";

export const useEventDetails = (eventId: string | undefined) => {
  if (!eventId) {
    console.error("[useEventDetails] No event ID provided");
  } else {
    console.log(`[useEventDetails] Hook initialized with event ID: ${eventId}`);
  }

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
  const [error, setError] = useState<Error | null>(null);

  const timestamp = () => {
    return new Date().toISOString();
  };

  const { 
    data: event, 
    isLoading: isLoadingEvent, 
    error: eventError, 
    refetch: refetchEvent, 
    isError: isEventError 
  } = useQuery({
    queryKey: ["event", eventId, retryAttempt],
    queryFn: async () => {
      if (!eventId) {
        console.error(`[${timestamp()}] No event ID provided`);
        throw new Error("ID do evento não fornecido");
      }
      
      try {
        console.log(`[${timestamp()}] Fetching event with ID: ${eventId} - Attempt: ${retryAttempt + 1}`);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          console.error(`[${timestamp()}] Error fetching event:`, error);
          throw new Error(`Erro ao buscar evento: ${error.message}`);
        }
        
        if (!data) {
          console.error(`[${timestamp()}] Event not found with ID: ${eventId}`);
          throw new Error("Evento não encontrado");
        }
        
        console.log(`[${timestamp()}] Event found successfully:`, data);
        return data as Event;
      } catch (error: any) {
        console.error(`[${timestamp()}] Exception fetching event:`, error);
        setError(error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!eventId
  });

  const { 
    data: batches, 
    isLoading: isLoadingBatches, 
    error: batchesError, 
    refetch: refetchBatches, 
    isError: isBatchesError 
  } = useQuery({
    queryKey: ["batches", eventId, retryAttempt],
    queryFn: async () => {
      if (!eventId) {
        console.error(`[${timestamp()}] No event ID provided for fetching batches`);
        throw new Error("ID do evento não fornecido");
      }

      try {
        console.log(`[${timestamp()}] Fetching batches for event: ${eventId}`);
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("event_id", eventId)
          .eq("is_visible", true)
          .order("order_number", { ascending: true });

        if (error) {
          console.error(`[${timestamp()}] Error fetching batches:`, error);
          throw new Error(`Erro ao buscar lotes: ${error.message}`);
        }

        const validBatches = (data || []).filter(batch => batch && batch.id);
        
        if (validBatches.length !== (data || []).length) {
          console.warn(`[${timestamp()}] Some invalid batches were filtered out`);
        }

        console.log(`[${timestamp()}] Batches found: ${validBatches.length}`);
        return validBatches as Batch[];
      } catch (error: any) {
        console.error(`[${timestamp()}] Exception fetching batches:`, error);
        setError(error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!eventId
  });

  useQuery({
    queryKey: ["referrer", referralCode, retryAttempt],
    queryFn: async () => {
      if (!referralCode) return null;
      
      try {
        console.log(`[${timestamp()}] Fetching reference for code: ${referralCode}`);
        const { data, error } = await supabase
          .from("referrals")
          .select("referrer_id")
          .eq("code", referralCode)
          .maybeSingle();
          
        if (error || !data) {
          console.log(`[${timestamp()}] No reference found for code: ${referralCode}`);
          return null;
        }
        
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("name")
          .eq("id", data.referrer_id)
          .maybeSingle();
          
        if (userError || !userData) {
          console.log(`[${timestamp()}] No user found for referrer_id: ${data.referrer_id}`);
          return null;
        }
        
        console.log(`[${timestamp()}] Reference found, name: ${userData.name}`);
        setReferrer({ name: userData.name });
        return userData;
      } catch (e) {
        console.error(`[${timestamp()}] Error fetching reference:`, e);
        return null;
      }
    },
    retry: 1,
    enabled: !!referralCode
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      console.log(`[${timestamp()}] Creating profile with CPF: ${cpf}, Birth date: ${birthDate}, Phone: ${phone}`);
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
      console.error(`[${timestamp()}] Error creating profile:`, error);
    },
  });

  const createReferralMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) throw new Error("ID do evento não encontrado");
      console.log(`[${timestamp()}] Generating referral link for event: ${eventId}`);
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
      console.error(`[${timestamp()}] Error generating referral link:`, error);
    },
  });

  const refreshData = useCallback(() => {
    const newRetryAttempt = retryAttempt + 1;
    console.log(`[${timestamp()}] Forcing data reload, new attempt: ${newRetryAttempt}`);
    setError(null);
    setRetryAttempt(newRetryAttempt);
    
    setTimeout(() => {
      refetchEvent();
      refetchBatches();
    }, 500);
  }, [retryAttempt, refetchEvent, refetchBatches]);

  useEffect(() => {
    if (eventError || batchesError) {
      console.log(`[${timestamp()}] Detected errors: Event=${!!eventError}, Batches=${!!batchesError}`);
      setError(eventError || batchesError);
    }
  }, [eventError, batchesError]);

  useEffect(() => {
    if (event && batches) {
      console.log(`[${timestamp()}] Successfully loaded event and batches data:`, {
        eventId: event.id,
        eventTitle: event.title,
        batchesCount: batches.length
      });
    }
  }, [event, batches]);

  return {
    event,
    batches: batches || [],
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
    hasError: isEventError || isBatchesError,
    retryAttempt,
    error
  };
};
