export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      batches: {
        Row: {
          available_tickets: number
          batch_group: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_id: string
          id: string
          is_visible: boolean | null
          max_purchase: number | null
          min_purchase: number | null
          order_number: number
          price: number
          start_date: string
          status: string | null
          title: string
          total_tickets: number
          visibility: string | null
        }
        Insert: {
          available_tickets: number
          batch_group?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_id: string
          id?: string
          is_visible?: boolean | null
          max_purchase?: number | null
          min_purchase?: number | null
          order_number: number
          price: number
          start_date: string
          status?: string | null
          title: string
          total_tickets: number
          visibility?: string | null
        }
        Update: {
          available_tickets?: number
          batch_group?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_id?: string
          id?: string
          is_visible?: boolean | null
          max_purchase?: number | null
          min_purchase?: number | null
          order_number?: number
          price?: number
          start_date?: string
          status?: string | null
          title?: string
          total_tickets?: number
          visibility?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          approved_tickets: number | null
          available_tickets: number
          average_ticket_price: number | null
          checked_in_count: number | null
          created_at: string
          date: string
          description: string
          form_fields_count: number | null
          gross_revenue: number | null
          id: string
          image: string
          location: string
          net_revenue: number | null
          pdv_count: number | null
          pending_orders: number | null
          pending_tickets: number | null
          price: number
          promo_codes_count: number | null
          refunded_tickets: number | null
          staff_count: number | null
          status: string | null
          time: string
          title: string
          total_checkins: number | null
          view_count: number | null
        }
        Insert: {
          approved_tickets?: number | null
          available_tickets: number
          average_ticket_price?: number | null
          checked_in_count?: number | null
          created_at?: string
          date: string
          description: string
          form_fields_count?: number | null
          gross_revenue?: number | null
          id?: string
          image: string
          location: string
          net_revenue?: number | null
          pdv_count?: number | null
          pending_orders?: number | null
          pending_tickets?: number | null
          price: number
          promo_codes_count?: number | null
          refunded_tickets?: number | null
          staff_count?: number | null
          status?: string | null
          time: string
          title: string
          total_checkins?: number | null
          view_count?: number | null
        }
        Update: {
          approved_tickets?: number | null
          available_tickets?: number
          average_ticket_price?: number | null
          checked_in_count?: number | null
          created_at?: string
          date?: string
          description?: string
          form_fields_count?: number | null
          gross_revenue?: number | null
          id?: string
          image?: string
          location?: string
          net_revenue?: number | null
          pdv_count?: number | null
          pending_orders?: number | null
          pending_tickets?: number | null
          price?: number
          promo_codes_count?: number | null
          refunded_tickets?: number | null
          staff_count?: number | null
          status?: string | null
          time?: string
          title?: string
          total_checkins?: number | null
          view_count?: number | null
        }
        Relationships: []
      }
      loyalty_points_history: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          points: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_preferences: {
        Row: {
          attempts: number | null
          card_token: string | null
          created_at: string
          error_message: string | null
          event_id: string
          external_id: string | null
          id: string
          init_point: string
          installments: number | null
          last_attempt_at: string | null
          payment_method_id: string | null
          payment_type: string | null
          qr_code: string | null
          qr_code_base64: string | null
          status: string | null
          ticket_quantity: number
          total_amount: number
          user_id: string
        }
        Insert: {
          attempts?: number | null
          card_token?: string | null
          created_at?: string
          error_message?: string | null
          event_id: string
          external_id?: string | null
          id?: string
          init_point: string
          installments?: number | null
          last_attempt_at?: string | null
          payment_method_id?: string | null
          payment_type?: string | null
          qr_code?: string | null
          qr_code_base64?: string | null
          status?: string | null
          ticket_quantity: number
          total_amount: number
          user_id: string
        }
        Update: {
          attempts?: number | null
          card_token?: string | null
          created_at?: string
          error_message?: string | null
          event_id?: string
          external_id?: string | null
          id?: string
          init_point?: string
          installments?: number | null
          last_attempt_at?: string | null
          payment_method_id?: string | null
          payment_type?: string | null
          qr_code?: string | null
          qr_code_base64?: string | null
          status?: string | null
          ticket_quantity?: number
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      referral_uses: {
        Row: {
          created_at: string
          event_id: string
          id: string
          referral_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          referral_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          referral_id?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          event_id: string
          id: string
          referrer_id: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          event_id: string
          id?: string
          referrer_id: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          event_id?: string
          id?: string
          referrer_id?: string
          used_count?: number
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          reward_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent: number
          reward_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          reward_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          id: string
          image: string | null
          points_required: number
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description: string
          id?: string
          image?: string | null
          points_required: number
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          points_required?: number
          title?: string
        }
        Relationships: []
      }
      saved_cards: {
        Row: {
          card_brand: string
          card_token: string
          created_at: string
          id: string
          last_four_digits: string
          user_id: string
        }
        Insert: {
          card_brand: string
          card_token: string
          created_at?: string
          id?: string
          last_four_digits: string
          user_id: string
        }
        Update: {
          card_brand?: string
          card_token?: string
          created_at?: string
          id?: string
          last_four_digits?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_participants: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          ticket_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          ticket_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          ticket_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string
          id: string
          purchase_date: string
          qr_code: string
          qr_code_background: string | null
          qr_code_foreground: string | null
          qr_code_logo: string | null
          qr_code_logo_size: number | null
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          purchase_date?: string
          qr_code: string
          qr_code_background?: string | null
          qr_code_foreground?: string | null
          qr_code_logo?: string | null
          qr_code_logo_size?: number | null
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          purchase_date?: string
          qr_code?: string
          qr_code_background?: string | null
          qr_code_foreground?: string | null
          qr_code_logo?: string | null
          qr_code_logo_size?: number | null
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          loyalty_points: number
          name: string | null
          phone: string | null
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id: string
          loyalty_points?: number
          name?: string | null
          phone?: string | null
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          loyalty_points?: number
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_batch_tickets: {
        Args: {
          p_event_id: string
          p_quantity: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
