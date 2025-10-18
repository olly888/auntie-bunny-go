export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appeal_tickets: {
        Row: {
          appeal_type: string
          completed_at: string | null
          content: string
          created_at: string | null
          id: string
          notes: string | null
          result: string | null
          status: string | null
          ticket_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appeal_type: string
          completed_at?: string | null
          content: string
          created_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          status?: string | null
          ticket_number: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appeal_type?: string
          completed_at?: string | null
          content?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          status?: string | null
          ticket_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appeal_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder: string
          account_number_last4: string
          bank_name: string
          created_at: string
          id: string
          is_default: boolean
          owner_profile_id: string
          updated_at: string
        }
        Insert: {
          account_holder: string
          account_number_last4: string
          bank_name: string
          created_at?: string
          id?: string
          is_default?: boolean
          owner_profile_id: string
          updated_at?: string
        }
        Update: {
          account_holder?: string
          account_number_last4?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_default?: boolean
          owner_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          author_id: string
          author_name: string | null
          content: string
          created_at: string
          customer_phone: string
          id: string
          order_id: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name?: string | null
          content: string
          created_at?: string
          customer_phone: string
          id?: string
          order_id: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string | null
          content?: string
          created_at?: string
          customer_phone?: string
          id?: string
          order_id?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_receipts: {
        Row: {
          created_at: string
          id: string
          notification_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          audience_type: string
          audience_value: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          route: string | null
          route_params: Json | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          audience_type?: string
          audience_value?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          route?: string | null
          route_params?: Json | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          audience_type?: string
          audience_value?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          route?: string | null
          route_params?: Json | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      offline_logs: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          offline_at: string
          online_at: string | null
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          offline_at?: string
          online_at?: string | null
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          offline_at?: string
          online_at?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      order_photos: {
        Row: {
          created_at: string
          id: string
          order_id: string
          photo_url: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          photo_url: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          photo_url?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_photos_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          assigned_at: string | null
          assignee_id: string | null
          completed_at: string | null
          contact_name: string | null
          contact_phone: string | null
          coupon_discount: number
          created_at: string
          distance_minutes: number | null
          duration_minutes: number
          id: string
          latitude: number | null
          longitude: number | null
          paid_amount: number
          payment_method: string | null
          payment_status: string
          payout: number
          platform_revenue: number | null
          refund_amount: number
          settled: boolean
          settled_at: string | null
          settled_month: string | null
          started_at: string | null
          status: string
          store_id: string | null
          total_amount: number
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          assigned_at?: string | null
          assignee_id?: string | null
          completed_at?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coupon_discount?: number
          created_at?: string
          distance_minutes?: number | null
          duration_minutes: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          paid_amount?: number
          payment_method?: string | null
          payment_status?: string
          payout: number
          platform_revenue?: number | null
          refund_amount?: number
          settled?: boolean
          settled_at?: string | null
          settled_month?: string | null
          started_at?: string | null
          status?: string
          store_id?: string | null
          total_amount?: number
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          assigned_at?: string | null
          assignee_id?: string | null
          completed_at?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coupon_discount?: number
          created_at?: string
          distance_minutes?: number | null
          duration_minutes?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          paid_amount?: number
          payment_method?: string | null
          payment_status?: string
          payout?: number
          platform_revenue?: number | null
          refund_amount?: number
          settled?: boolean
          settled_at?: string | null
          settled_month?: string | null
          started_at?: string | null
          status?: string
          store_id?: string | null
          total_amount?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_adjustments: {
        Row: {
          adjustment_month: string
          bonus_amount: number
          created_at: string
          created_by: string
          id: string
          notes: string | null
          penalty_amount: number
          performance_level: string | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          adjustment_month: string
          bonus_amount?: number
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          penalty_amount?: number
          performance_level?: string | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          adjustment_month?: string
          bonus_amount?: number
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          penalty_amount?: number
          performance_level?: string | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          agreement_ip: string | null
          agreement_signed_at: string | null
          agreement_version: string | null
          avatar_url: string | null
          badge_type: string | null
          created_at: string
          education: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          employee_id: string | null
          employment_type: string | null
          first_login_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          id_card_number: string | null
          is_id_verified: boolean | null
          is_training_completed: boolean | null
          last_password_change_at: string | null
          onboarding_status: string | null
          phone: string | null
          prejob_training: Database["public"]["Enums"]["prejob_training_status"]
          prejob_training_completed_at: string | null
          require_password_change: boolean
          role: string
          skill_cert_type: string | null
          skill_cert_url: string | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          store_id: string | null
          training_notes: string | null
          updated_at: string
          wecom_qr_url: string | null
        }
        Insert: {
          age?: number | null
          agreement_ip?: string | null
          agreement_signed_at?: string | null
          agreement_version?: string | null
          avatar_url?: string | null
          badge_type?: string | null
          created_at?: string
          education?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id?: string | null
          employment_type?: string | null
          first_login_at?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          id_card_number?: string | null
          is_id_verified?: boolean | null
          is_training_completed?: boolean | null
          last_password_change_at?: string | null
          onboarding_status?: string | null
          phone?: string | null
          prejob_training?: Database["public"]["Enums"]["prejob_training_status"]
          prejob_training_completed_at?: string | null
          require_password_change?: boolean
          role?: string
          skill_cert_type?: string | null
          skill_cert_url?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
          store_id?: string | null
          training_notes?: string | null
          updated_at?: string
          wecom_qr_url?: string | null
        }
        Update: {
          age?: number | null
          agreement_ip?: string | null
          agreement_signed_at?: string | null
          agreement_version?: string | null
          avatar_url?: string | null
          badge_type?: string | null
          created_at?: string
          education?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id?: string | null
          employment_type?: string | null
          first_login_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          id_card_number?: string | null
          is_id_verified?: boolean | null
          is_training_completed?: boolean | null
          last_password_change_at?: string | null
          onboarding_status?: string | null
          phone?: string | null
          prejob_training?: Database["public"]["Enums"]["prejob_training_status"]
          prejob_training_completed_at?: string | null
          require_password_change?: boolean
          role?: string
          skill_cert_type?: string | null
          skill_cert_url?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
          store_id?: string | null
          training_notes?: string | null
          updated_at?: string
          wecom_qr_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_certifications: {
        Row: {
          auto_verified: boolean
          created_at: string
          health_cert_expires_at: string | null
          health_cert_no: string | null
          health_cert_url: string | null
          id: string
          id_card_back_url: string | null
          id_card_front_url: string | null
          id_card_number: string | null
          notes: string | null
          provider_id: string
          status: Database["public"]["Enums"]["provider_cert_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          auto_verified?: boolean
          created_at?: string
          health_cert_expires_at?: string | null
          health_cert_no?: string | null
          health_cert_url?: string | null
          id?: string
          id_card_back_url?: string | null
          id_card_front_url?: string | null
          id_card_number?: string | null
          notes?: string | null
          provider_id: string
          status?: Database["public"]["Enums"]["provider_cert_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          auto_verified?: boolean
          created_at?: string
          health_cert_expires_at?: string | null
          health_cert_no?: string | null
          health_cert_url?: string | null
          id?: string
          id_card_back_url?: string | null
          id_card_front_url?: string | null
          id_card_number?: string | null
          notes?: string | null
          provider_id?: string
          status?: Database["public"]["Enums"]["provider_cert_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_certifications_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_certifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recruit_applications: {
        Row: {
          age: number | null
          available_time: string | null
          created_at: string
          experience_years: number | null
          gender: string | null
          id: string
          motivation: string | null
          name: string
          notes: string | null
          phone: string
          referrer_code: string | null
          status: string
          updated_at: string
          work_area: string | null
        }
        Insert: {
          age?: number | null
          available_time?: string | null
          created_at?: string
          experience_years?: number | null
          gender?: string | null
          id?: string
          motivation?: string | null
          name: string
          notes?: string | null
          phone: string
          referrer_code?: string | null
          status?: string
          updated_at?: string
          work_area?: string | null
        }
        Update: {
          age?: number | null
          available_time?: string | null
          created_at?: string
          experience_years?: number | null
          gender?: string | null
          id?: string
          motivation?: string | null
          name?: string
          notes?: string | null
          phone?: string
          referrer_code?: string | null
          status?: string
          updated_at?: string
          work_area?: string | null
        }
        Relationships: []
      }
      referral_events: {
        Row: {
          created_at: string
          event_type: Database["public"]["Enums"]["referral_event_type"]
          extra: Json
          id: string
          ip_hash: string | null
          referral_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: Database["public"]["Enums"]["referral_event_type"]
          extra?: Json
          id?: string
          ip_hash?: string | null
          referral_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: Database["public"]["Enums"]["referral_event_type"]
          extra?: Json
          id?: string
          ip_hash?: string | null
          referral_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          invite_type: string
          invitee_profile_id: string | null
          inviter_id: string
          metadata: Json
          ref_code: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_type: string
          invitee_profile_id?: string | null
          inviter_id: string
          metadata?: Json
          ref_code: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_type?: string
          invitee_profile_id?: string | null
          inviter_id?: string
          metadata?: Json
          ref_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_invitee_profile_id_fkey"
            columns: ["invitee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      settlement_configs: {
        Row: {
          created_at: string
          created_by: string
          duration_minutes: number
          effective_from: string
          id: string
          is_active: boolean
          service_item: string
          service_type: string
          settle_price_per_minute: number
          updated_at: string
          updated_by: string | null
          user_price_per_minute: number
        }
        Insert: {
          created_at?: string
          created_by: string
          duration_minutes: number
          effective_from?: string
          id?: string
          is_active?: boolean
          service_item: string
          service_type: string
          settle_price_per_minute: number
          updated_at?: string
          updated_by?: string | null
          user_price_per_minute: number
        }
        Update: {
          created_at?: string
          created_by?: string
          duration_minutes?: number
          effective_from?: string
          id?: string
          is_active?: boolean
          service_item?: string
          service_type?: string
          settle_price_per_minute?: number
          updated_at?: string
          updated_by?: string | null
          user_price_per_minute?: number
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ui_permissions: {
        Row: {
          action: string
          allowed: boolean
          created_at: string
          id: string
          module: string
          role: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          action: string
          allowed?: boolean
          created_at?: string
          id?: string
          module: string
          role: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          action?: string
          allowed?: boolean
          created_at?: string
          id?: string
          module?: string
          role?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      onboarding_funnel: {
        Row: {
          activated_count: number | null
          activation_rate_percent: number | null
          id_verified_count: number | null
          registered_count: number | null
          training_completed_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_search_profiles: {
        Args: { search_term: string }
        Returns: {
          created_at: string
          full_name: string
          id: string
          phone: string
          role: string
          store_id: string
          store_name: string
          updated_at: string
        }[]
      }
      claim_order: {
        Args: { order_id: string }
        Returns: boolean
      }
      create_demo_completed_orders: {
        Args: Record<PropertyKey, never>
        Returns: {
          order_id: string
          order_type: string
          payout: number
          status: string
        }[]
      }
      create_demo_order_for_my_store: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      ensure_referral: {
        Args: { invite_type: string }
        Returns: {
          created_at: string
          id: string
          invite_type: string
          invitee_profile_id: string | null
          inviter_id: string
          metadata: Json
          ref_code: string
          status: string
          updated_at: string
        }
      }
      get_abnormal_orders: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          assigned_at: string
          assignee_id: string
          completed_at: string
          contact_name: string
          contact_phone: string
          created_at: string
          distance_minutes: number
          duration_minutes: number
          id: string
          latitude: number
          longitude: number
          payout: number
          started_at: string
          status: string
          store_id: string
          type: string
          updated_at: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role_secure: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_filtered_orders: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          assigned_at: string
          assignee_id: string
          completed_at: string
          contact_name: string
          contact_phone: string
          created_at: string
          distance_minutes: number
          duration_minutes: number
          id: string
          latitude: number
          longitude: number
          payout: number
          started_at: string
          status: string
          store_id: string
          type: string
          updated_at: string
        }[]
      }
      get_user_notifications: {
        Args: Record<PropertyKey, never>
        Returns: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          route: string
          route_params: Json
          title: string
          type: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: boolean
      }
      update_order_status: {
        Args: { new_status: string; order_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "worker"
      prejob_training_status: "not_started" | "in_progress" | "completed"
      provider_cert_status: "pending" | "verified" | "rejected"
      referral_event_type: "scan" | "register" | "qualify" | "reward"
      skill_level: "junior" | "mid" | "senior" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "worker"],
      prejob_training_status: ["not_started", "in_progress", "completed"],
      provider_cert_status: ["pending", "verified", "rejected"],
      referral_event_type: ["scan", "register", "qualify", "reward"],
      skill_level: ["junior", "mid", "senior", "expert"],
    },
  },
} as const
