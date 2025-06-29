import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper functions for database operations
export const db = {
  // Projects
  async createProject(name: string, description?: string) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Clients
  async saveClients(projectId: string, clients: any[]) {
    // Delete existing clients for this project
    await supabase
      .from('clients')
      .delete()
      .eq('project_id', projectId);

    // Insert new clients
    const clientsWithProjectId = clients.map(client => ({
      ...client,
      project_id: projectId,
    }));

    const { data, error } = await supabase
      .from('clients')
      .insert(clientsWithProjectId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getClients(projectId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Workers
  async saveWorkers(projectId: string, workers: any[]) {
    // Delete existing workers for this project
    await supabase
      .from('workers')
      .delete()
      .eq('project_id', projectId);

    // Insert new workers
    const workersWithProjectId = workers.map(worker => ({
      ...worker,
      project_id: projectId,
    }));

    const { data, error } = await supabase
      .from('workers')
      .insert(workersWithProjectId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getWorkers(projectId: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Tasks
  async saveTasks(projectId: string, tasks: any[]) {
    // Delete existing tasks for this project
    await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId);

    // Insert new tasks
    const tasksWithProjectId = tasks.map(task => ({
      ...task,
      project_id: projectId,
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksWithProjectId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Rules
  async saveRules(projectId: string, rules: any[]) {
    // Delete existing rules for this project
    await supabase
      .from('rules')
      .delete()
      .eq('project_id', projectId);

    // Insert new rules
    const rulesWithProjectId = rules.map(rule => ({
      ...rule,
      project_id: projectId,
    }));

    const { data, error } = await supabase
      .from('rules')
      .insert(rulesWithProjectId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getRules(projectId: string) {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Validation Errors
  async saveValidationErrors(projectId: string, errors: any[]) {
    // Delete existing validation errors for this project
    await supabase
      .from('validation_errors')
      .delete()
      .eq('project_id', projectId);

    // Insert new validation errors
    const errorsWithProjectId = errors.map(error => ({
      ...error,
      project_id: projectId,
    }));

    const { data, error } = await supabase
      .from('validation_errors')
      .insert(errorsWithProjectId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getValidationErrors(projectId: string) {
    const { data, error } = await supabase
      .from('validation_errors')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Priority Weights
  async savePriorityWeights(projectId: string, priorities: Record<string, number>) {
    const { data, error } = await supabase
      .from('priority_weights')
      .upsert({
        project_id: projectId,
        weights: priorities,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPriorityWeights(projectId: string) {
    const { data, error } = await supabase
      .from('priority_weights')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToProject(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`project-${projectId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          filter: `project_id=eq.${projectId}` 
        }, 
        callback
      )
      .subscribe();
  },

  unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  },
};