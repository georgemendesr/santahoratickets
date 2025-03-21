
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  available_tickets: number;
  status?: 'published' | 'draft' | 'ended' | string;
  created_at?: string;
  gross_revenue?: number;
  net_revenue?: number;
  average_ticket_price?: number;
  pending_orders?: number;
  view_count?: number;
  promo_codes_count?: number;
  pdv_count?: number;
  form_fields_count?: number;
  staff_count?: number;
  checked_in_count?: number;
  total_checkins?: number;
  approved_tickets?: number;
  pending_tickets?: number;
  refunded_tickets?: number;
}

export interface Batch {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  price: number;
  available_tickets: number;
  total_tickets: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'ended' | 'sold_out';
  created_at?: string;
  order_number: number;
  visibility: 'public' | 'guest_only' | 'internal_pdv';
  is_visible: boolean;
  min_purchase: number;
  max_purchase?: number;
  batch_group?: string;
}
