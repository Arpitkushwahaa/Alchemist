'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { db, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
}

export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface ValidationError {
  id: string;
  type: 'error' | 'warning';
  message: string;
  entity: 'clients' | 'workers' | 'tasks';
  rowIndex?: number;
  field?: string;
  suggestion?: string;
}

export interface Rule {
  id: string;
  type: 'coRun' | 'slotRestriction' | 'loadLimit' | 'phaseWindow' | 'patternMatch' | 'precedence';
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DataState {
  // Project management
  currentProject: Project | null;
  projects: Project[];
  
  // Data entities
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  validationErrors: ValidationError[];
  rules: Rule[];
  priorities: Record<string, number>;
  
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: string;
}

type DataAction = 
  // Project actions
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  
  // Data actions
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'SET_WORKERS'; payload: Worker[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPDATE_CLIENT'; payload: { index: number; client: Client } }
  | { type: 'UPDATE_WORKER'; payload: { index: number; worker: Worker } }
  | { type: 'UPDATE_TASK'; payload: { index: number; task: Task } }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'ADD_RULE'; payload: Rule }
  | { type: 'UPDATE_RULE'; payload: { id: string; rule: Rule } }
  | { type: 'DELETE_RULE'; payload: string }
  | { type: 'SET_PRIORITIES'; payload: Record<string, number> }
  
  // UI state actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: string };

const initialState: DataState = {
  currentProject: null,
  projects: [],
  clients: [],
  workers: [],
  tasks: [],
  validationErrors: [],
  rules: [],
  priorities: {
    'Priority Level': 0.3,
    'Task Fulfillment': 0.25,
    'Skill Match': 0.2,
    'Load Balance': 0.15,
    'Phase Preference': 0.1
  },
  isLoading: false,
  isSaving: false,
};

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p),
        currentProject: state.currentProject?.id === action.payload.id ? action.payload : state.currentProject
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject
      };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'SET_WORKERS':
      return { ...state, workers: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'UPDATE_CLIENT':
      const updatedClients = [...state.clients];
      updatedClients[action.payload.index] = action.payload.client;
      return { ...state, clients: updatedClients };
    case 'UPDATE_WORKER':
      const updatedWorkers = [...state.workers];
      updatedWorkers[action.payload.index] = action.payload.worker;
      return { ...state, workers: updatedWorkers };
    case 'UPDATE_TASK':
      const updatedTasks = [...state.tasks];
      updatedTasks[action.payload.index] = action.payload.task;
      return { ...state, tasks: updatedTasks };
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    case 'ADD_RULE':
      return { ...state, rules: [...state.rules, action.payload] };
    case 'UPDATE_RULE':
      return {
        ...state,
        rules: state.rules.map(rule => 
          rule.id === action.payload.id ? action.payload.rule : rule
        )
      };
    case 'DELETE_RULE':
      return {
        ...state,
        rules: state.rules.filter(rule => rule.id !== action.payload)
      };
    case 'SET_PRIORITIES':
      return { ...state, priorities: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload };
    default:
      return state;
  }
}

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
  actions: {
    // Project management
    createProject: (name: string, description?: string) => Promise<void>;
    loadProjects: () => Promise<void>;
    loadProject: (projectId: string) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    
    // Data persistence
    saveAllData: () => Promise<void>;
    loadAllData: (projectId: string) => Promise<void>;
    
    // Auto-save functionality
    enableAutoSave: () => void;
    disableAutoSave: () => void;
  };
} | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [autoSaveInterval, setAutoSaveInterval] = React.useState<NodeJS.Timeout | null>(null);

  // Project management actions
  const createProject = async (name: string, description?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const project = await db.createProject(name, description);
      dispatch({ type: 'ADD_PROJECT', payload: project });
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const projects = await db.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const project = await db.getProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      await loadAllData(projectId);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const project = await db.updateProject(id, updates);
      dispatch({ type: 'UPDATE_PROJECT', payload: project });
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await db.deleteProject(id);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  // Data persistence actions
  const saveAllData = async () => {
    if (!state.currentProject) {
      toast.error('No project selected');
      return;
    }

    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      const projectId = state.currentProject.id;

      // Save all data in parallel
      await Promise.all([
        state.clients.length > 0 ? db.saveClients(projectId, state.clients.map(client => ({
          client_id: client.ClientID,
          client_name: client.ClientName,
          priority_level: client.PriorityLevel,
          requested_task_ids: client.RequestedTaskIDs,
          group_tag: client.GroupTag,
          attributes_json: client.AttributesJSON,
        }))) : Promise.resolve(),
        
        state.workers.length > 0 ? db.saveWorkers(projectId, state.workers.map(worker => ({
          worker_id: worker.WorkerID,
          worker_name: worker.WorkerName,
          skills: worker.Skills,
          available_slots: worker.AvailableSlots,
          max_load_per_phase: worker.MaxLoadPerPhase,
          worker_group: worker.WorkerGroup,
          qualification_level: worker.QualificationLevel,
        }))) : Promise.resolve(),
        
        state.tasks.length > 0 ? db.saveTasks(projectId, state.tasks.map(task => ({
          task_id: task.TaskID,
          task_name: task.TaskName,
          category: task.Category,
          duration: task.Duration,
          required_skills: task.RequiredSkills,
          preferred_phases: task.PreferredPhases,
          max_concurrent: task.MaxConcurrent,
        }))) : Promise.resolve(),
        
        state.rules.length > 0 ? db.saveRules(projectId, state.rules.map(rule => ({
          rule_id: rule.id,
          type: rule.type,
          name: rule.name,
          description: rule.description,
          parameters: rule.parameters,
          enabled: rule.enabled,
        }))) : Promise.resolve(),
        
        state.validationErrors.length > 0 ? db.saveValidationErrors(projectId, state.validationErrors.map(error => ({
          error_id: error.id,
          type: error.type,
          message: error.message,
          entity: error.entity,
          row_index: error.rowIndex,
          field: error.field,
          suggestion: error.suggestion,
        }))) : Promise.resolve(),
        
        db.savePriorityWeights(projectId, state.priorities),
      ]);

      dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toISOString() });
      toast.success('All data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  const loadAllData = async (projectId: string) => {
    try {
      // Load all data in parallel
      const [clients, workers, tasks, rules, validationErrors, priorityWeights] = await Promise.all([
        db.getClients(projectId),
        db.getWorkers(projectId),
        db.getTasks(projectId),
        db.getRules(projectId),
        db.getValidationErrors(projectId),
        db.getPriorityWeights(projectId),
      ]);

      // Transform database format to application format
      dispatch({ type: 'SET_CLIENTS', payload: clients.map(client => ({
        ClientID: client.client_id,
        ClientName: client.client_name,
        PriorityLevel: client.priority_level,
        RequestedTaskIDs: client.requested_task_ids,
        GroupTag: client.group_tag,
        AttributesJSON: client.attributes_json,
      })) });

      dispatch({ type: 'SET_WORKERS', payload: workers.map(worker => ({
        WorkerID: worker.worker_id,
        WorkerName: worker.worker_name,
        Skills: worker.skills,
        AvailableSlots: worker.available_slots,
        MaxLoadPerPhase: worker.max_load_per_phase,
        WorkerGroup: worker.worker_group,
        QualificationLevel: worker.qualification_level,
      })) });

      dispatch({ type: 'SET_TASKS', payload: tasks.map(task => ({
        TaskID: task.task_id,
        TaskName: task.task_name,
        Category: task.category,
        Duration: task.duration,
        RequiredSkills: task.required_skills,
        PreferredPhases: task.preferred_phases,
        MaxConcurrent: task.max_concurrent,
      })) });

      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: validationErrors.map(error => ({
        id: error.error_id,
        type: error.type as 'error' | 'warning',
        message: error.message,
        entity: error.entity as 'clients' | 'workers' | 'tasks',
        rowIndex: error.row_index || undefined,
        field: error.field || undefined,
        suggestion: error.suggestion || undefined,
      })) });

      // Set rules
      const transformedRules = rules.map(rule => ({
        id: rule.rule_id,
        type: rule.type as Rule['type'],
        name: rule.name,
        description: rule.description,
        parameters: rule.parameters as Record<string, any>,
        enabled: rule.enabled,
      }));
      
      // Clear existing rules and add loaded ones
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: [] });
      transformedRules.forEach(rule => {
        dispatch({ type: 'ADD_RULE', payload: rule });
      });

      // Set priority weights
      if (priorityWeights?.weights) {
        dispatch({ type: 'SET_PRIORITIES', payload: priorityWeights.weights as Record<string, number> });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load project data');
    }
  };

  // Auto-save functionality
  const enableAutoSave = () => {
    if (autoSaveInterval) return; // Already enabled

    const interval = setInterval(() => {
      if (state.currentProject && !state.isSaving) {
        saveAllData();
      }
    }, 30000); // Auto-save every 30 seconds

    setAutoSaveInterval(interval);
  };

  const disableAutoSave = () => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      setAutoSaveInterval(null);
    }
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Enable auto-save when a project is selected
  useEffect(() => {
    if (state.currentProject) {
      enableAutoSave();
    } else {
      disableAutoSave();
    }

    return () => disableAutoSave();
  }, [state.currentProject]);

  const actions = {
    createProject,
    loadProjects,
    loadProject,
    updateProject,
    deleteProject,
    saveAllData,
    loadAllData,
    enableAutoSave,
    disableAutoSave,
  };

  return (
    <DataContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}