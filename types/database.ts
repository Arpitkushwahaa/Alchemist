export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          project_id: string
          client_id: string
          client_name: string
          priority_level: number
          requested_task_ids: string
          group_tag: string
          attributes_json: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          client_id: string
          client_name: string
          priority_level: number
          requested_task_ids: string
          group_tag: string
          attributes_json: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          client_id?: string
          client_name?: string
          priority_level?: number
          requested_task_ids?: string
          group_tag?: string
          attributes_json?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      workers: {
        Row: {
          id: string
          project_id: string
          worker_id: string
          worker_name: string
          skills: string
          available_slots: string
          max_load_per_phase: number
          worker_group: string
          qualification_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          worker_id: string
          worker_name: string
          skills: string
          available_slots: string
          max_load_per_phase: number
          worker_group: string
          qualification_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          worker_id?: string
          worker_name?: string
          skills?: string
          available_slots?: string
          max_load_per_phase?: number
          worker_group?: string
          qualification_level?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          task_id: string
          task_name: string
          category: string
          duration: number
          required_skills: string
          preferred_phases: string
          max_concurrent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          task_id: string
          task_name: string
          category: string
          duration: number
          required_skills: string
          preferred_phases: string
          max_concurrent: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          task_id?: string
          task_name?: string
          category?: string
          duration?: number
          required_skills?: string
          preferred_phases?: string
          max_concurrent?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      rules: {
        Row: {
          id: string
          project_id: string
          rule_id: string
          type: string
          name: string
          description: string
          parameters: Json
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          rule_id: string
          type: string
          name: string
          description: string
          parameters: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          rule_id?: string
          type?: string
          name?: string
          description?: string
          parameters?: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rules_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      validation_errors: {
        Row: {
          id: string
          project_id: string
          error_id: string
          type: string
          message: string
          entity: string
          row_index: number | null
          field: string | null
          suggestion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          error_id: string
          type: string
          message: string
          entity: string
          row_index?: number | null
          field?: string | null
          suggestion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          error_id?: string
          type?: string
          message?: string
          entity?: string
          row_index?: number | null
          field?: string | null
          suggestion?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_errors_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      priority_weights: {
        Row: {
          id: string
          project_id: string
          weights: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          weights: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          weights?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "priority_weights_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}