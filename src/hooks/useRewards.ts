
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Reward, RewardRedemption, UserProfile } from '@/types';
import { toast } from 'sonner';

export const useRewards = (userId?: string, userProfile?: UserProfile | null) => {
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<RewardRedemption[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [loadingRedemptions, setLoadingRedemptions] = useState(false);

  const getAvailableRewards = async (): Promise<Reward[]> => {
    try {
      setLoadingRewards(true);
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      
      setAvailableRewards(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return [];
    } finally {
      setLoadingRewards(false);
    }
  };

  const getMyRedemptions = async (): Promise<RewardRedemption[]> => {
    if (!userId) return [];

    try {
      setLoadingRedemptions(true);
      const { data, error } = await supabase
        .from('reward_redemptions')
        .select(`
          *,
          rewards (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Converte o status para o tipo correto
      const typedRedemptions = data?.map(item => ({
        ...item,
        status: item.status as "pending" | "approved" | "rejected" | "delivered"
      })) || [];
      
      setMyRedemptions(typedRedemptions);
      return typedRedemptions;
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      return [];
    } finally {
      setLoadingRedemptions(false);
    }
  };

  const redeemReward = async (rewardId: string, pointsRequired: number): Promise<RewardRedemption | null> => {
    if (!userId || !userProfile) {
      toast.error('Usuário não autenticado ou sem perfil');
      return null;
    }

    if (userProfile.loyalty_points < pointsRequired) {
      toast.error('Pontos insuficientes para este resgate');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('reward_redemptions')
        .insert([
          {
            user_id: userId,
            reward_id: rewardId,
            points_spent: pointsRequired,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Resgate realizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Erro ao realizar resgate');
      return null;
    }
  };

  return {
    availableRewards,
    myRedemptions,
    loadingRewards,
    loadingRedemptions,
    getAvailableRewards,
    getMyRedemptions,
    redeemReward
  };
};
