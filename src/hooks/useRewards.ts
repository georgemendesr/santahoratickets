
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
      
      // Corrigido para usar a relação correta entre as tabelas
      const { data, error } = await supabase
        .from('reward_redemptions')
        .select(`
          id,
          user_id,
          reward_id,
          points_spent,
          status,
          created_at,
          updated_at,
          rewards:rewards(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Formatar os dados retornados
      const formattedRedemptions: RewardRedemption[] = (data || []).map(item => {
        return {
          ...item,
          rewards: item.rewards as unknown as Reward,
          status: item.status as "pending" | "approved" | "rejected" | "delivered"
        };
      });
      
      setMyRedemptions(formattedRedemptions);
      return formattedRedemptions;
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
      return data as RewardRedemption;
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
