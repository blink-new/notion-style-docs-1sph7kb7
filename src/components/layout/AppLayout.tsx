
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useWorkspaceStore } from '../../store/workspace';
import { usePageStore } from '../../store/page';
import Header from './Header';
import Sidebar from './Sidebar';
import AuthModal from '../auth/AuthModal';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';

export default function AppLayout() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading: authLoading, getUser } = useAuthStore();
  const { fetchWorkspaces, currentWorkspace } = useWorkspaceStore();
  const { fetchPages } = usePageStore();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchPages(currentWorkspace.id);
    }
  }, [currentWorkspace, fetchPages]);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header onLogin={handleLogin} />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={80}>
            <main className="h-full overflow-auto bg-background p-6">
              <Outlet />
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}