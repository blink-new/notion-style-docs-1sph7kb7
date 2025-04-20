
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Page } from '../types';

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
  fetchPages: (workspaceId: string) => Promise<void>;
  setCurrentPage: (page: Page) => void;
  createPage: (title: string, workspaceId: string, parentId?: string | null) => Promise<Page | null>;
  updatePage: (id: string, data: Partial<Page>) => Promise<void>;
  updatePageContent: (id: string, content: any[]) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  reorderPages: (pages: Page[]) => Promise<void>;
}

// Helper function to build page tree
const buildPageTree = (pages: Page[]): Page[] => {
  const pageMap = new Map<string, Page>();
  const rootPages: Page[] = [];

  // First pass: create a map of all pages
  pages.forEach(page => {
    pageMap.set(page.id, { ...page, children: [] });
  });

  // Second pass: build the tree structure
  pages.forEach(page => {
    const pageWithChildren = pageMap.get(page.id)!;
    
    if (page.parent_id && pageMap.has(page.parent_id)) {
      const parent = pageMap.get(page.parent_id)!;
      parent.children = [...(parent.children || []), pageWithChildren];
      parent.children.sort((a, b) => a.position - b.position);
    } else {
      rootPages.push(pageWithChildren);
    }
  });

  // Sort root pages by position
  rootPages.sort((a, b) => a.position - b.position);
  
  return rootPages;
};

export const usePageStore = create<PageState>((set, get) => ({
  pages: [],
  currentPage: null,
  loading: false,
  error: null,

  fetchPages: async (workspaceId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      const pagesWithTree = buildPageTree(data as Page[]);
      
      set({ 
        pages: pagesWithTree,
        currentPage: pagesWithTree.length > 0 ? pagesWithTree[0] : null
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  createPage: async (title, workspaceId, parentId = null) => {
    try {
      set({ loading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) throw new Error('User not authenticated');
      
      // Get the highest position for the new page
      const { data: positionData, error: positionError } = await supabase
        .from('pages')
        .select('position')
        .eq('workspace_id', workspaceId)
        .eq('parent_id', parentId)
        .order('position', { ascending: false })
        .limit(1);
      
      if (positionError) throw positionError;
      
      const position = positionData.length > 0 ? positionData[0].position + 1 : 0;
      
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          content: [{ type: 'paragraph', children: [{ text: '' }] }],
          workspace_id: workspaceId,
          parent_id: parentId,
          position,
          user_id: userData.user.id,
          is_public: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newPage = data as Page;
      
      // Update the pages state
      await get().fetchPages(workspaceId);
      
      return newPage;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updatePage: async (id, data) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('pages')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh pages
      if (get().currentPage?.workspace_id) {
        await get().fetchPages(get().currentPage.workspace_id);
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updatePageContent: async (id, content) => {
    try {
      set({ error: null });
      
      const { error } = await supabase
        .from('pages')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the current page content without refetching everything
      set((state) => ({
        currentPage: state.currentPage?.id === id 
          ? { ...state.currentPage, content } 
          : state.currentPage
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deletePage: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh pages
      if (get().currentPage?.workspace_id) {
        await get().fetchPages(get().currentPage.workspace_id);
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  reorderPages: async (pages) => {
    try {
      set({ loading: true, error: null });
      
      // Create an array of updates
      const updates = pages.map((page, index) => ({
        id: page.id,
        position: index,
        parent_id: page.parent_id
      }));
      
      // Update all pages in a single batch
      const { error } = await supabase
        .from('pages')
        .upsert(updates);
      
      if (error) throw error;
      
      // Refresh pages
      if (get().currentPage?.workspace_id) {
        await get().fetchPages(get().currentPage.workspace_id);
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));