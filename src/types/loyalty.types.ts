
export interface LoyaltyPointsHistory {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  event_id?: string;
  created_at?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  active: boolean;
  image?: string;
  created_at?: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  created_at?: string;
  updated_at?: string;
  rewards?: Reward;
}
