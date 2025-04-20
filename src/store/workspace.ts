
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Workspace } from '../types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace) => void;
  createWorkspace: (name: string) => Promise<void>;
  updateWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        workspaces: data as Workspace[],
        currentWorkspace: data.length > 0 ? data[0] as Workspace : null
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },

  createWorkspace: async (name) => {
    try {
      set({ loading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          user_id: userData.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        workspaces: [data as Workspace, ...state.workspaces],
        currentWorkspace: data as Workspace
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateWorkspace: async (id, name) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('workspaces')
        .update({ name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        workspaces: state.workspaces.map(w => w.id === id ? (data as Workspace) : w),
        currentWorkspace: state.currentWorkspace?.id === id ? (data as Workspace) : state.currentWorkspace
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteWorkspace: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const workspaces = get().workspaces.filter(w => w.id !== id);
      
      set({
        workspaces,
        currentWorkspace: workspaces.length > 0 ? workspaces[0] : null
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));