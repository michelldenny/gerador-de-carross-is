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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brands: {
        Row: {
          accent_color: string
          background_color: string
          created_at: string
          default_cta: string | null
          font_family: string
          id: string
          instagram_handle: string | null
          logo_text: string | null
          logo_url: string | null
          name: string
          phone: string | null
          primary_color: string
          secondary_color: string
          secondary_font_family: string | null
          settings: Json
          slug: string | null
          text_color: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          accent_color?: string
          background_color?: string
          created_at?: string
          default_cta?: string | null
          font_family?: string
          id?: string
          instagram_handle?: string | null
          logo_text?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          secondary_font_family?: string | null
          settings?: Json
          slug?: string | null
          text_color?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          accent_color?: string
          background_color?: string
          created_at?: string
          default_cta?: string | null
          font_family?: string
          id?: string
          instagram_handle?: string | null
          logo_text?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          secondary_font_family?: string | null
          settings?: Json
          slug?: string | null
          text_color?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          entry_type: string
          generation_id: string | null
          id: string
          idempotency_key: string | null
          metadata: Json
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          entry_type: string
          generation_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          entry_type?: string
          generation_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_ledger_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generation_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_sources: {
        Row: {
          accessed_at: string | null
          claim: string
          created_at: string
          generation_id: string | null
          id: string
          metadata: Json
          project_id: string | null
          publication_date: string | null
          publisher: string | null
          source_title: string | null
          source_url: string | null
          status: string
          supported_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessed_at?: string | null
          claim: string
          created_at?: string
          generation_id?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          publication_date?: string | null
          publisher?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          supported_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessed_at?: string | null
          claim?: string
          created_at?: string
          generation_id?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          publication_date?: string | null
          publisher?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          supported_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_sources_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generation_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_runs: {
        Row: {
          briefing: Json
          completed_at: string | null
          completion_tokens: number | null
          corrections: Json
          created_at: string
          error_code: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          idempotency_key: string
          model: string | null
          output: Json | null
          project_id: string | null
          prompt_tokens: number | null
          provider: string
          reserved_credits: number
          review: Json | null
          ruleset_version: string | null
          schema_version: string | null
          started_at: string | null
          status: string
          trace: Json | null
          updated_at: string
          user_id: string
          validation: Json | null
          validator_version: string | null
        }
        Insert: {
          briefing: Json
          completed_at?: string | null
          completion_tokens?: number | null
          corrections?: Json
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          idempotency_key: string
          model?: string | null
          output?: Json | null
          project_id?: string | null
          prompt_tokens?: number | null
          provider?: string
          reserved_credits?: number
          review?: Json | null
          ruleset_version?: string | null
          schema_version?: string | null
          started_at?: string | null
          status?: string
          trace?: Json | null
          updated_at?: string
          user_id: string
          validation?: Json | null
          validator_version?: string | null
        }
        Update: {
          briefing?: Json
          completed_at?: string | null
          completion_tokens?: number | null
          corrections?: Json
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          idempotency_key?: string
          model?: string | null
          output?: Json | null
          project_id?: string | null
          prompt_tokens?: number | null
          provider?: string
          reserved_credits?: number
          review?: Json | null
          ruleset_version?: string | null
          schema_version?: string | null
          started_at?: string | null
          status?: string
          trace?: Json | null
          updated_at?: string
          user_id?: string
          validation?: Json | null
          validator_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credit_balance: number
          display_name: string | null
          id: string
          plan: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credit_balance?: number
          display_name?: string | null
          id: string
          plan?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credit_balance?: number
          display_name?: string | null
          id?: string
          plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          brand_id: string | null
          caption: string
          created_at: string
          creation_mode: string
          format: string
          generation_metadata: Json | null
          hashtags: string[]
          height: number
          id: string
          status: string
          theme: string
          title: string
          updated_at: string
          user_id: string
          version: number
          width: number
        }
        Insert: {
          brand_id?: string | null
          caption?: string
          created_at?: string
          creation_mode?: string
          format?: string
          generation_metadata?: Json | null
          hashtags?: string[]
          height: number
          id?: string
          status?: string
          theme: string
          title: string
          updated_at?: string
          user_id: string
          version?: number
          width: number
        }
        Update: {
          brand_id?: string | null
          caption?: string
          created_at?: string
          creation_mode?: string
          format?: string
          generation_metadata?: Json | null
          hashtags?: string[]
          height?: number
          id?: string
          status?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      slides: {
        Row: {
          blocks: Json
          body: string | null
          created_at: string
          cta: string | null
          evidence_ids: string[]
          highlight: string | null
          id: string
          image: Json | null
          list_items: string[] | null
          narrative_role: string | null
          position: number
          project_id: string
          styles: Json
          subtitle: string | null
          template_id: string
          title: string | null
          type: string
          updated_at: string
          version: number
        }
        Insert: {
          blocks?: Json
          body?: string | null
          created_at?: string
          cta?: string | null
          evidence_ids?: string[]
          highlight?: string | null
          id?: string
          image?: Json | null
          list_items?: string[] | null
          narrative_role?: string | null
          position: number
          project_id: string
          styles?: Json
          subtitle?: string | null
          template_id: string
          title?: string | null
          type: string
          updated_at?: string
          version?: number
        }
        Update: {
          blocks?: Json
          body?: string | null
          created_at?: string
          cta?: string | null
          evidence_ids?: string[]
          highlight?: string | null
          id?: string
          image?: Json | null
          list_items?: string[] | null
          narrative_role?: string | null
          position?: number
          project_id?: string
          styles?: Json
          subtitle?: string | null
          template_id?: string
          title?: string | null
          type?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "slides_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_generation: {
        Args: {
          p_completion_tokens?: number
          p_corrections?: Json
          p_estimated_cost_usd?: number
          p_generation_id: string
          p_output: Json
          p_project_id: string
          p_prompt_tokens?: number
          p_review: Json
          p_trace: Json
          p_validation: Json
        }
        Returns: {
          briefing: Json
          completed_at: string | null
          completion_tokens: number | null
          corrections: Json
          created_at: string
          error_code: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          idempotency_key: string
          model: string | null
          output: Json | null
          project_id: string | null
          prompt_tokens: number | null
          provider: string
          reserved_credits: number
          review: Json | null
          ruleset_version: string | null
          schema_version: string | null
          started_at: string | null
          status: string
          trace: Json | null
          updated_at: string
          user_id: string
          validation: Json | null
          validator_version: string | null
        }
        SetofOptions: {
          from: "*"
          to: "generation_runs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_generation_and_reserve_credits: {
        Args: {
          p_briefing: Json
          p_credits: number
          p_idempotency_key: string
          p_model?: string
          p_provider?: string
          p_user_id: string
        }
        Returns: {
          briefing: Json
          completed_at: string | null
          completion_tokens: number | null
          corrections: Json
          created_at: string
          error_code: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          idempotency_key: string
          model: string | null
          output: Json | null
          project_id: string | null
          prompt_tokens: number | null
          provider: string
          reserved_credits: number
          review: Json | null
          ruleset_version: string | null
          schema_version: string | null
          started_at: string | null
          status: string
          trace: Json | null
          updated_at: string
          user_id: string
          validation: Json | null
          validator_version: string | null
        }
        SetofOptions: {
          from: "*"
          to: "generation_runs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      fail_generation_and_refund: {
        Args: {
          p_error_code: string
          p_error_message: string
          p_generation_id: string
        }
        Returns: {
          briefing: Json
          completed_at: string | null
          completion_tokens: number | null
          corrections: Json
          created_at: string
          error_code: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          idempotency_key: string
          model: string | null
          output: Json | null
          project_id: string | null
          prompt_tokens: number | null
          provider: string
          reserved_credits: number
          review: Json | null
          ruleset_version: string | null
          schema_version: string | null
          started_at: string | null
          status: string
          trace: Json | null
          updated_at: string
          user_id: string
          validation: Json | null
          validator_version: string | null
        }
        SetofOptions: {
          from: "*"
          to: "generation_runs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_generation_running: {
        Args: { p_generation_id: string }
        Returns: {
          briefing: Json
          completed_at: string | null
          completion_tokens: number | null
          corrections: Json
          created_at: string
          error_code: string | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          idempotency_key: string
          model: string | null
          output: Json | null
          project_id: string | null
          prompt_tokens: number | null
          provider: string
          reserved_credits: number
          review: Json | null
          ruleset_version: string | null
          schema_version: string | null
          started_at: string | null
          status: string
          trace: Json | null
          updated_at: string
          user_id: string
          validation: Json | null
          validator_version: string | null
        }
        SetofOptions: {
          from: "*"
          to: "generation_runs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
