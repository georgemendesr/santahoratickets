
export interface PaymentPreference {
  id: string;
  init_point: string;
  ticket_quantity: number;
  total_amount: number;
  event_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at?: string;
  attempts?: number;
  card_token?: string;
  error_message?: string;
  external_id?: string;
  installments?: number;
  last_attempt_at?: string;
  payment_type?: string;
  payment_method_id?: string;
  qr_code?: string;
  qr_code_base64?: string;
  checkout_url?: string;
}
