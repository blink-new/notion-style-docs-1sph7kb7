
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { usePageStore } from '../store/page';
import { Button } from '../components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const { pages, currentPage } = usePageStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's a current page, navigate to it
    if (currentPage) {
      navigate(`/page/${currentPage.id}`);
    }
  }, [currentPage, navigate]);

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="mb-6 text-4xl font-bold">Welcome to Notion Docs</h1>
        <p className="mb-8 max-w-md text-center text-muted-foreground">
          A Notion-inspired documentation app with a rich block-based text editor, collapsible sidebar for page organization, and more.
        </p>
        <div className="space-y-4">
          <p className="text-center">Sign in to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {pages.length === 0 ? (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Create your first page</h2>
          <p className="mb-6 text-muted-foreground">
            Get started by creating a new page in your workspace
          </p>
          <Button 
            onClick={() => document.querySelector<HTMLButtonElement>('.sidebar-create-page-button')?.click()}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Page
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Select a page</h2>
          <p className="text-muted-foreground">
            Choose a page from the sidebar to get started
          </p>
        </div>
      )}
    </div>
  );
}