
import { useProfile } from './useProfile';
import { useLoyaltyPoints } from './useLoyaltyPoints';
import { useRewards } from './useRewards';
import { useReferrals } from './useReferrals';

export const useProfileComposite = (userId?: string) => {
  const { profile, loading, createProfile } = useProfile(userId);
  const { pointsHistory, loadingPoints, getLoyaltyPoints } = useLoyaltyPoints(userId);
  const { 
    availableRewards, 
    myRedemptions, 
    loadingRewards,
    loadingRedemptions,
    getAvailableRewards, 
    getMyRedemptions, 
    redeemReward 
  } = useRewards(userId, profile);
  const { referralCode, loadingReferral, createReferral } = useReferrals(userId);

  return {
    // Profile
    profile,
    loading,
    createProfile,
    
    // Loyalty Points
    pointsHistory,
    loadingPoints,
    getLoyaltyPoints,
    
    // Rewards
    availableRewards,
    myRedemptions,
    loadingRewards,
    loadingRedemptions,
    getAvailableRewards,
    getMyRedemptions,
    redeemReward,
    
    // Referrals
    referralCode,
    loadingReferral,
    createReferral
  };
};
