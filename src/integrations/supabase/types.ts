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
      customer_notes: {
        Row: {
          author_id: string
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
            referencedRelation: "abnormal_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "abnormal_orders"
            referencedColumns: ["id"]
          },
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
          created_at: string
          distance_minutes: number | null
          duration_minutes: number
          id: string
          latitude: number | null
          longitude: number | null
          payout: number
          started_at: string | null
          status: string
          store_id: string | null
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
          created_at?: string
          distance_minutes?: number | null
          duration_minutes: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          payout: number
          started_at?: string | null
          status?: string
          store_id?: string | null
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
          created_at?: string
          distance_minutes?: number | null
          duration_minutes?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          payout?: number
          started_at?: string | null
          status?: string
          store_id?: string | null
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
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          store_id: string | null
          updated_at: string
          wecom_qr_url: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          store_id?: string | null
          updated_at?: string
          wecom_qr_url?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          store_id?: string | null
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
    }
    Views: {
      abnormal_orders: {
        Row: {
          address: string | null
          assigned_at: string | null
          assignee_id: string | null
          completed_at: string | null
          created_at: string | null
          distance_minutes: number | null
          duration_minutes: number | null
          id: string | null
          latitude: number | null
          longitude: number | null
          payout: number | null
          started_at: string | null
          status: string | null
          store_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          assigned_at?: string | null
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          distance_minutes?: number | null
          duration_minutes?: number | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          payout?: number | null
          started_at?: string | null
          status?: string | null
          store_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          assigned_at?: string | null
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          distance_minutes?: number | null
          duration_minutes?: number | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          payout?: number | null
          started_at?: string | null
          status?: string | null
          store_id?: string | null
          type?: string | null
          updated_at?: string | null
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
    }
    Functions: {
      claim_order: {
        Args: { order_id: string }
        Returns: boolean
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
      update_order_status: {
        Args: { new_status: string; order_id: string }
        Returns: boolean
      }
    }
    Enums: {
      referral_event_type: "scan" | "register" | "qualify" | "reward"
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
      referral_event_type: ["scan", "register", "qualify", "reward"],
    },
  },
} as const
