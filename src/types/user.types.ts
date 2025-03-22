
export interface UserProfile {
  id: string;
  cpf: string | null;
  birth_date: string | null;
  loyalty_points: number;
  created_at?: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  referral_code?: string | null;
}

export type UserRole = 'admin' | 'user';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at?: string;
}
