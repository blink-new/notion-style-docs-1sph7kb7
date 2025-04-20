
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useWorkspaceStore } from '../store/workspace';
import { usePageStore } from '../store/page';
import { User, Workspace, Page } from '../types';

// Sample data
const SAMPLE_USER: User = {
  id: 'sample-user-id',
  email: 'sample@example.com',
  display_name: 'Sample User',
  avatar_url: null
};

const SAMPLE_WORKSPACE: Workspace = {
  id: 'sample-workspace-id',
  name: 'Sample Workspace',
  user_id: SAMPLE_USER.id
};

const SAMPLE_PAGES: Page[] = [
  {
    id: 'sample-page-1',
    title: 'Getting Started',
    content: [
      { 
        type: 'heading-one', 
        children: [{ text: 'Welcome to Notion-Style Docs!' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'This is a sample page to help you get started with the app.' }] 
      },
      { 
        type: 'heading-two', 
        children: [{ text: 'Features' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Rich text editing with formatting' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Organize pages in a workspace' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Share pages with others' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: '' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'Try editing this page or creating a new one!' }] 
      }
    ],
    workspace_id: SAMPLE_WORKSPACE.id,
    parent_id: null,
    is_public: true,
    position: 0,
    user_id: SAMPLE_USER.id
  },
  {
    id: 'sample-page-2',
    title: 'Project Notes',
    content: [
      { 
        type: 'heading-two', 
        children: [{ text: 'Project Ideas' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'Here are some ideas for the project:' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Add image upload support' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Implement dark mode' }] 
      },
      { 
        type: 'bulleted-list', 
        children: [{ text: 'Add collaborative editing' }] 
      }
    ],
    workspace_id: SAMPLE_WORKSPACE.id,
    parent_id: null,
    is_public: false,
    position: 1,
    user_id: SAMPLE_USER.id
  },
  {
    id: 'sample-page-3',
    title: 'Meeting Notes',
    content: [
      { 
        type: 'heading-two', 
        children: [{ text: 'Team Meeting - July 15, 2023' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'Attendees: John, Sarah, Mike' }] 
      },
      { 
        type: 'heading-three', 
        children: [{ text: 'Agenda' }] 
      },
      { 
        type: 'numbered-list', 
        children: [{ text: 'Project status update' }] 
      },
      { 
        type: 'numbered-list', 
        children: [{ text: 'Timeline review' }] 
      },
      { 
        type: 'numbered-list', 
        children: [{ text: 'Next steps' }] 
      },
      { 
        type: 'heading-three', 
        children: [{ text: 'Action Items' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'Sarah: Complete design review by Friday' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'Mike: Update documentation' }] 
      },
      { 
        type: 'paragraph', 
        children: [{ text: 'John: Schedule follow-up meeting' }] 
      }
    ],
    workspace_id: SAMPLE_WORKSPACE.id,
    parent_id: null,
    is_public: false,
    position: 2,
    user_id: SAMPLE_USER.id
  }
];

// Create a nested page
const NESTED_PAGE: Page = {
  id: 'sample-page-4',
  title: 'Development Tasks',
  content: [
    { 
      type: 'heading-two', 
      children: [{ text: 'Development Tasks' }] 
    },
    { 
      type: 'paragraph', 
      children: [{ text: 'List of tasks to complete:' }] 
    },
    { 
      type: 'bulleted-list', 
      children: [{ text: 'Fix sidebar responsiveness' }] 
    },
    { 
      type: 'bulleted-list', 
      children: [{ text: 'Implement page sharing' }] 
    },
    { 
      type: 'bulleted-list', 
      children: [{ text: 'Add user settings page' }] 
    }
  ],
  workspace_id: SAMPLE_WORKSPACE.id,
  parent_id: 'sample-page-2',
  is_public: false,
  position: 0,
  user_id: SAMPLE_USER.id
};

// Add the nested page to the sample pages
SAMPLE_PAGES.push(NESTED_PAGE);

// Build the page tree structure
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

interface DevModeContextType {
  isDevMode: boolean;
  isLoading: boolean;
  activateDevMode: () => void;
  deactivateDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  isLoading: false,
  activateDevMode: () => {},
  deactivateDevMode: () => {}
});

export const useDevMode = () => useContext(DevModeContext);

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the stores
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();
  const pageStore = usePageStore();

  // Check for dev mode in URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('dev_mode');
    
    if (devMode === 'true') {
      activateDevMode();
    }
  }, []);

  const activateDevMode = () => {
    if (authStore.user) {
      // If already logged in, don't override
      return;
    }
    
    setIsLoading(true);
    
    // Set the sample user in the auth store
    authStore.user = SAMPLE_USER;
    
    // Set the sample workspace in the workspace store
    workspaceStore.workspaces = [SAMPLE_WORKSPACE];
    workspaceStore.currentWorkspace = SAMPLE_WORKSPACE;
    
    // Set the sample pages in the page store
    const pagesWithTree = buildPageTree(SAMPLE_PAGES);
    pageStore.pages = pagesWithTree;
    pageStore.currentPage = pagesWithTree[0];
    
    // Update URL to include dev_mode parameter without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('dev_mode', 'true');
    window.history.pushState({}, '', url.toString());
    
    setIsDevMode(true);
    setIsLoading(false);
  };

  const deactivateDevMode = () => {
    if (!isDevMode) return;
    
    // Reset stores
    authStore.user = null;
    workspaceStore.workspaces = [];
    workspaceStore.currentWorkspace = null;
    pageStore.pages = [];
    pageStore.currentPage = null;
    
    // Remove dev_mode parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('dev_mode');
    window.history.pushState({}, '', url.toString());
    
    setIsDevMode(false);
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, isLoading, activateDevMode, deactivateDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};