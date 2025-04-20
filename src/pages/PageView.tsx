
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageStore } from '../store/page';
import { useAuthStore } from '../store/auth';
import Editor from '../components/editor/Editor';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Globe, Lock, Share } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PageView() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const { pages, currentPage, setCurrentPage, updatePage } = usePageStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    // Find the page in the store
    const page = findPageById(pages, id);
    
    if (page) {
      setCurrentPage(page);
      setTitle(page.title);
      setIsPublic(page.is_public);
    } else {
      navigate('/');
    }
  }, [id, pages, setCurrentPage, navigate]);

  // Helper function to find a page by ID in the nested structure
  const findPageById = (pages: typeof currentPage[], id: string): typeof currentPage | null => {
    for (const page of pages) {
      if (page.id === id) {
        return page;
      }
      
      if (page.children && page.children.length > 0) {
        const found = findPageById(page.children, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  const handleTitleChange = async () => {
    if (!currentPage || !title.trim()) return;
    
    setIsEditing(false);
    
    if (title !== currentPage.title) {
      await updatePage(currentPage.id, { title: title.trim() });
    }
  };

  const togglePublicStatus = async () => {
    if (!currentPage) return;
    
    const newStatus = !isPublic;
    setIsPublic(newStatus);
    
    await updatePage(currentPage.id, { is_public: newStatus });
    
    toast.success(newStatus ? 'Page is now public' : 'Page is now private');
  };

  const copyShareLink = () => {
    if (!currentPage) return;
    
    const url = `${window.location.origin}/shared/${currentPage.id}`;
    navigator.clipboard.writeText(url);
    
    toast.success('Share link copied to clipboard');
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Please sign in to view this page</p>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleChange()}
            className="text-3xl font-bold"
            autoFocus
          />
        ) : (
          <h1 
            className="text-3xl font-bold hover:cursor-pointer hover:bg-muted/50"
            onClick={() => setIsEditing(true)}
          >
            {currentPage.title}
          </h1>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={togglePublicStatus}
          >
            {isPublic ? (
              <>
                <Globe size={16} />
                Public
              </>
            ) : (
              <>
                <Lock size={16} />
                Private
              </>
            )}
          </Button>
          
          {isPublic && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={copyShareLink}
            >
              <Share size={16} />
              Share
            </Button>
          )}
        </div>
      </div>
      
      <Editor 
        pageId={currentPage.id} 
        initialContent={currentPage.content} 
      />
    </div>
  );
}