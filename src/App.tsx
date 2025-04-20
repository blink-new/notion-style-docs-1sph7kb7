
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import PageView from './pages/PageView';
import SharedPage from './pages/SharedPage';
import { supabase } from './lib/supabase';
import { User, Workspace, Page } from './types';
import { useWorkspaceStore } from './store/workspace';
import { usePageStore } from './store/page';

// Sample data for development mode
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
  },
  {
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
  }
];

function App() {
  const { getUser } = useAuthStore();
  const [isDevMode, setIsDevMode] = useState(false);

  // Check for dev mode in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('dev_mode');
    
    if (devMode === 'true') {
      console.log('Activating development mode');
      activateDevMode();
    } else {
      // Normal authentication flow
      getUser();
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        getUser();
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [getUser]);

  // Function to activate development mode
  const activateDevMode = () => {
    console.log('Setting up development mode data');
    setIsDevMode(true);
    
    // Set sample data directly in the stores
    const authStore = useAuthStore.getState();
    const workspaceStore = useWorkspaceStore.getState();
    const pageStore = usePageStore.getState();
    
    // Set user
    authStore.user = SAMPLE_USER;
    
    // Set workspace
    workspaceStore.workspaces = [SAMPLE_WORKSPACE];
    workspaceStore.currentWorkspace = SAMPLE_WORKSPACE;
    
    // Set pages
    const rootPages = SAMPLE_PAGES.filter(page => !page.parent_id);
    
    // Add children to pages
    SAMPLE_PAGES.forEach(page => {
      if (page.parent_id) {
        const parentPage = SAMPLE_PAGES.find(p => p.id === page.parent_id);
        if (parentPage) {
          if (!parentPage.children) parentPage.children = [];
          parentPage.children.push(page);
        }
      }
    });
    
    pageStore.pages = rootPages;
    pageStore.currentPage = rootPages[0];
  };

  // Dev mode indicator
  const DevModeIndicator = () => {
    if (!isDevMode) return null;
    
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
          <span className="font-medium">Development Mode</span>
        </div>
        <button 
          className="ml-2 rounded border border-yellow-300 bg-yellow-50 px-2 py-1 text-xs hover:bg-yellow-200"
          onClick={() => {
            // Remove dev mode
            setIsDevMode(false);
            
            // Reset stores
            const authStore = useAuthStore.getState();
            const workspaceStore = useWorkspaceStore.getState();
            const pageStore = usePageStore.getState();
            
            authStore.user = null;
            workspaceStore.workspaces = [];
            workspaceStore.currentWorkspace = null;
            pageStore.pages = [];
            pageStore.currentPage = null;
            
            // Remove dev_mode parameter from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('dev_mode');
            window.history.pushState({}, '', url.toString());
            
            // Redirect to home
            window.location.href = '/';
          }}
        >
          Exit
        </button>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="page/:id" element={<PageView />} />
        </Route>
        <Route path="/shared/:id" element={<SharedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DevModeIndicator />
    </BrowserRouter>
  );
}

export default App;