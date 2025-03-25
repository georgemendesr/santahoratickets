
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Referral } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useReferrals(eventId?: string) {
  const [loadingReferral, setLoadingReferral] = useState(false);
  const { userProfile } = useAuthStore();
  const referralCode = userProfile?.referral_code || '';

  // Function to create a new referral code for a specific event
  const createReferral = async (eventId: string): Promise<Referral> => {
    if (!userProfile) {
      throw new Error("Usuário não autenticado");
    }

    setLoadingReferral(true);
    try {
      // Generate a unique referral code
      const code = `${userProfile.id.substring(0, 6)}-${Date.now().toString(36)}`;
      
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          event_id: eventId,
          referrer_id: userProfile.id,
          code: code,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Referral;
    } catch (error) {
      console.error("Erro ao criar código de referência:", error);
      throw error;
    } finally {
      setLoadingReferral(false);
    }
  };

  // Function to get referrer information from a referral code
  const useGetReferrer = (code?: string) => {
    const { data: referrer, isLoading } = useQuery({
      queryKey: ['referrer', code],
      queryFn: async () => {
        if (!code) return null;
        
        const { data: referral, error: referralError } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('code', code)
          .single();
        
        if (referralError || !referral) return null;
        
        const { data: user, error: userError } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', referral.referrer_id)
          .single();
        
        if (userError || !user) return null;
        
        return { name: user.name };
      },
      enabled: !!code
    });
    
    return { referrer, isLoading };
  };

  return {
    referralCode,
    loadingReferral,
    createReferral,
    useGetReferrer
  };
}
