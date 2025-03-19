
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types';
import { toast } from 'sonner';

export const useReferrals = (userId?: string) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loadingReferral, setLoadingReferral] = useState(false);

  const generateReferralCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_unique_referral_code');
    if (error) throw error;
    return data;
  };

  const createReferral = async (eventId: string): Promise<Referral | null> => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      setLoadingReferral(true);
      const code = await generateReferralCode();
      
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          {
            referrer_id: userId,
            event_id: eventId,
            code: code,
            used_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setReferralCode(data.code);
      toast.success('Link de indicação gerado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error creating referral:', error);
      toast.error('Erro ao gerar link de indicação');
      return null;
    } finally {
      setLoadingReferral(false);
    }
  };

  return {
    referralCode,
    loadingReferral,
    createReferral
  };
};
