
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  cpf?: string;
  birth_date?: string;
  phone?: string;
  loyalty_points?: number;
  tickets_purchased?: number;
  events_attended?: number;
  referral_code?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'staff';
  created_at?: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  created_at?: string;
  updated_at?: string;
}
