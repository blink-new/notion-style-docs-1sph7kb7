
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useWorkspaceStore } from '../../store/workspace';
import { usePageStore } from '../../store/page';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus } from 'lucide-react';
import PageTree from '../page/PageTree';

export default function Sidebar() {
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const { user } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { pages, createPage } = usePageStore();
  const navigate = useNavigate();

  const handleCreatePage = async () => {
    if (!currentWorkspace) return;
    
    if (newPageTitle.trim()) {
      const newPage = await createPage(newPageTitle.trim(), currentWorkspace.id);
      setNewPageTitle('');
      setIsCreatePageOpen(false);
      
      if (newPage) {
        navigate(`/page/${newPage.id}`);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex h-full flex-col bg-sidebar-background p-4">
        <div className="flex-1 rounded-lg border border-dashed border-sidebar-border p-4 text-center text-sidebar-foreground/60">
          <p>Sign in to create and manage pages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-medium text-sidebar-foreground">Pages</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCreatePageOpen(true)}
          disabled={!currentWorkspace}
          className="sidebar-create-page-button"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        {pages.length > 0 ? (
          <PageTree pages={pages} />
        ) : (
          <div className="rounded-lg border border-dashed border-sidebar-border p-4 text-center text-sidebar-foreground/60">
            <p>No pages yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsCreatePageOpen(true)}
              disabled={!currentWorkspace}
            >
              Create your first page
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Page</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Untitled"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreatePage}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}