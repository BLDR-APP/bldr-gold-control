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
      companies: {
        Row: {
          address: string | null
          cnpj: string | null
          created_at: string | null
          created_by: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          created_at?: string | null
          created_by: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          created_at?: string | null
          created_by?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          equipment_needed: string[] | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          id: string
          image_url: string | null
          instructions: string[] | null
          is_system_exercise: boolean | null
          name: string
          primary_muscle_group: Database["public"]["Enums"]["muscle_group"]
          secondary_muscle_groups:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          tips: string[] | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_needed?: string[] | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_system_exercise?: boolean | null
          name: string
          primary_muscle_group: Database["public"]["Enums"]["muscle_group"]
          secondary_muscle_groups?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          tips?: string[] | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          equipment_needed?: string[] | null
          exercise_type?: Database["public"]["Enums"]["exercise_type"]
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_system_exercise?: boolean | null
          name?: string
          primary_muscle_group?: Database["public"]["Enums"]["muscle_group"]
          secondary_muscle_groups?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          tips?: string[] | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_per_100g: number
          carbs_per_100g: number | null
          created_at: string | null
          created_by: string | null
          fat_per_100g: number | null
          fiber_per_100g: number | null
          id: string
          is_verified: boolean | null
          name: string
          protein_per_100g: number | null
          sodium_per_100g: number | null
          sugar_per_100g: number | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g: number
          carbs_per_100g?: number | null
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          is_verified?: boolean | null
          name: string
          protein_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number | null
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          is_verified?: boolean | null
          name?: string
          protein_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_food_items: {
        Row: {
          calories: number
          carbs: number | null
          fat: number | null
          food_item_id: string | null
          id: string
          meal_id: string | null
          protein: number | null
          quantity_grams: number
        }
        Insert: {
          calories: number
          carbs?: number | null
          fat?: number | null
          food_item_id?: string | null
          id?: string
          meal_id?: string | null
          protein?: number | null
          quantity_grams: number
        }
        Update: {
          calories?: number
          carbs?: number | null
          fat?: number | null
          food_item_id?: string | null
          id?: string
          meal_id?: string | null
          protein?: number | null
          quantity_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_food_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_food_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "user_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intents: {
        Row: {
          amount: number
          billing_period: Database["public"]["Enums"]["billing_period"]
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string
          subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_period: Database["public"]["Enums"]["billing_period"]
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_period?: Database["public"]["Enums"]["billing_period"]
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          client_phone: string | null
          company_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          sale_date: string
          service_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          sale_date: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          sale_date?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          annual_price: number
          annual_price_text: string
          created_at: string | null
          description: string
          features: string[]
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          monthly_price: number
          monthly_price_text: string
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          stripe_annual_price_id: string | null
          stripe_monthly_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_price: number
          annual_price_text: string
          created_at?: string | null
          description: string
          features: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_price: number
          monthly_price_text: string
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          stripe_annual_price_id?: string | null
          stripe_monthly_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_price?: number
          annual_price_text?: string
          created_at?: string | null
          description?: string
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_price?: number
          monthly_price_text?: string
          name?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          stripe_annual_price_id?: string | null
          stripe_monthly_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          company_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          payment_method: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          company_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          payment_method?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achieved_at: string | null
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          id: string
          unit: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          achieved_at?: string | null
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          id?: string
          unit?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          achieved_at?: string | null
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          id?: string
          unit?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_meals: {
        Row: {
          created_at: string | null
          id: string
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_date?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          name?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_measurements: {
        Row: {
          id: string
          measured_at: string | null
          measurement_type: Database["public"]["Enums"]["measurement_type"]
          notes: string | null
          unit: string
          user_id: string | null
          value: number
        }
        Insert: {
          id?: string
          measured_at?: string | null
          measurement_type: Database["public"]["Enums"]["measurement_type"]
          notes?: string | null
          unit?: string
          user_id?: string | null
          value: number
        }
        Update: {
          id?: string
          measured_at?: string | null
          measurement_type?: Database["public"]["Enums"]["measurement_type"]
          notes?: string | null
          unit?: string
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          fitness_goal: Database["public"]["Enums"]["fitness_goal"] | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          height_cm: number | null
          id: string
          is_active: boolean | null
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          target_weight_kg: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height_cm?: number | null
          id: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          target_weight_kg?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height_cm?: number | null
          id?: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          target_weight_kg?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_period: Database["public"]["Enums"]["billing_period"]
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_period: Database["public"]["Enums"]["billing_period"]
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_period?: Database["public"]["Enums"]["billing_period"]
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_water_intake: {
        Row: {
          amount_ml: number
          date_logged: string | null
          id: string
          logged_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_ml: number
          date_logged?: string | null
          id?: string
          logged_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_ml?: number
          date_logged?: string | null
          id?: string
          logged_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_water_intake_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workouts: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          name: string
          notes: string | null
          started_at: string | null
          total_duration_seconds: number | null
          user_id: string | null
          workout_template_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          name: string
          notes?: string | null
          started_at?: string | null
          total_duration_seconds?: number | null
          user_id?: string | null
          workout_template_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string
          notes?: string | null
          started_at?: string | null
          total_duration_seconds?: number | null
          user_id?: string | null
          workout_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_workouts_workout_template_id_fkey"
            columns: ["workout_template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercise_sets: {
        Row: {
          completed_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          reps: number | null
          rest_seconds: number | null
          set_number: number
          user_workout_id: string | null
          weight_kg: number | null
        }
        Insert: {
          completed_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          set_number: number
          user_workout_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          completed_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          set_number?: number
          user_workout_id?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercise_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercise_sets_user_workout_id_fkey"
            columns: ["user_workout_id"]
            isOneToOne: false
            referencedRelation: "user_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_template_exercises: {
        Row: {
          distance_meters: number | null
          duration_seconds: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_template_id: string | null
        }
        Insert: {
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_template_id?: string | null
        }
        Update: {
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_template_exercises_workout_template_id_fkey"
            columns: ["workout_template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_duration_minutes: number | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          workout_type?: Database["public"]["Enums"]["workout_type"]
        }
        Relationships: [
          {
            foreignKeyName: "workout_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_workout_template: {
        Args: { template_uuid: string }
        Returns: boolean
      }
      is_admin_from_auth: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      activity_level:
        | "sedentary"
        | "lightly_active"
        | "moderately_active"
        | "very_active"
        | "extremely_active"
      billing_period: "monthly" | "annual"
      exercise_type:
        | "compound"
        | "isolation"
        | "cardio"
        | "stretching"
        | "plyometric"
      fitness_goal:
        | "weight_loss"
        | "muscle_gain"
        | "strength"
        | "endurance"
        | "general_fitness"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      measurement_type:
        | "weight"
        | "body_fat"
        | "muscle_mass"
        | "waist"
        | "chest"
        | "arms"
        | "thighs"
      muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "legs"
        | "abs"
        | "cardio"
        | "full_body"
      payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "canceled"
        | "requires_action"
      subscription_plan_type: "core" | "club"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "unpaid"
        | "trialing"
      user_role: "admin" | "trainer" | "member"
      workout_type: "strength" | "cardio" | "flexibility" | "sports" | "custom"
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
      activity_level: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extremely_active",
      ],
      billing_period: ["monthly", "annual"],
      exercise_type: [
        "compound",
        "isolation",
        "cardio",
        "stretching",
        "plyometric",
      ],
      fitness_goal: [
        "weight_loss",
        "muscle_gain",
        "strength",
        "endurance",
        "general_fitness",
      ],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
      measurement_type: [
        "weight",
        "body_fat",
        "muscle_mass",
        "waist",
        "chest",
        "arms",
        "thighs",
      ],
      muscle_group: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "legs",
        "abs",
        "cardio",
        "full_body",
      ],
      payment_status: [
        "pending",
        "succeeded",
        "failed",
        "canceled",
        "requires_action",
      ],
      subscription_plan_type: ["core", "club"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "unpaid",
        "trialing",
      ],
      user_role: ["admin", "trainer", "member"],
      workout_type: ["strength", "cardio", "flexibility", "sports", "custom"],
    },
  },
} as const
