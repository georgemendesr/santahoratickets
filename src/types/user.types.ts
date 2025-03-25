
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  loyalty_points?: number;
}

export interface UserPreference {
  id: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UserRoleType = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  created_at?: string;
}

export interface UserAuthResponse {
  session: any;
  user: any;
}
