
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoyaltyPointsHistory } from '@/types';

export const useLoyaltyPoints = (userId?: string) => {
  const [pointsHistory, setPointsHistory] = useState<LoyaltyPointsHistory[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const getLoyaltyPoints = async (): Promise<LoyaltyPointsHistory[]> => {
    if (!userId) return [];

    try {
      setLoadingPoints(true);
      const { data, error } = await supabase
        .from('loyalty_points_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPointsHistory(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      return [];
    } finally {
      setLoadingPoints(false);
    }
  };

  return {
    pointsHistory,
    loadingPoints,
    getLoyaltyPoints
  };
};
