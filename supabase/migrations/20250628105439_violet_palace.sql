/*
  # Initial Database Schema for Data Alchemist

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `user_id` (uuid, nullable for now)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `client_id` (text)
      - `client_name` (text)
      - `priority_level` (integer)
      - `requested_task_ids` (text)
      - `group_tag` (text)
      - `attributes_json` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `workers`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `worker_id` (text)
      - `worker_name` (text)
      - `skills` (text)
      - `available_slots` (text)
      - `max_load_per_phase` (integer)
      - `worker_group` (text)
      - `qualification_level` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `task_id` (text)
      - `task_name` (text)
      - `category` (text)
      - `duration` (integer)
      - `required_skills` (text)
      - `preferred_phases` (text)
      - `max_concurrent` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rules`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `rule_id` (text)
      - `type` (text)
      - `name` (text)
      - `description` (text)
      - `parameters` (jsonb)
      - `enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `validation_errors`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `error_id` (text)
      - `type` (text)
      - `message` (text)
      - `entity` (text)
      - `row_index` (integer, nullable)
      - `field` (text, nullable)
      - `suggestion` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `priority_weights`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `weights` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  user_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id text NOT NULL,
  client_name text NOT NULL,
  priority_level integer NOT NULL DEFAULT 1,
  requested_task_ids text NOT NULL DEFAULT '',
  group_tag text NOT NULL DEFAULT '',
  attributes_json text NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  worker_name text NOT NULL,
  skills text NOT NULL DEFAULT '',
  available_slots text NOT NULL DEFAULT '[]',
  max_load_per_phase integer NOT NULL DEFAULT 1,
  worker_group text NOT NULL DEFAULT '',
  qualification_level integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  task_name text NOT NULL,
  category text NOT NULL DEFAULT '',
  duration integer NOT NULL DEFAULT 1,
  required_skills text NOT NULL DEFAULT '',
  preferred_phases text NOT NULL DEFAULT '[]',
  max_concurrent integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rules table
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  rule_id text NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  parameters jsonb NOT NULL DEFAULT '{}',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create validation_errors table
CREATE TABLE IF NOT EXISTS validation_errors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  error_id text NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  entity text NOT NULL,
  row_index integer,
  field text,
  suggestion text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create priority_weights table
CREATE TABLE IF NOT EXISTS priority_weights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  weights jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_project_id ON clients(project_id);
CREATE INDEX IF NOT EXISTS idx_workers_project_id ON workers(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_rules_project_id ON rules(project_id);
CREATE INDEX IF NOT EXISTS idx_validation_errors_project_id ON validation_errors(project_id);
CREATE INDEX IF NOT EXISTS idx_priority_weights_project_id ON priority_weights(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_validation_errors_updated_at BEFORE UPDATE ON validation_errors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_priority_weights_updated_at BEFORE UPDATE ON priority_weights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_weights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - can be restricted later with auth)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on workers" ON workers FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on rules" ON rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on validation_errors" ON validation_errors FOR ALL USING (true);
CREATE POLICY "Allow all operations on priority_weights" ON priority_weights FOR ALL USING (true);