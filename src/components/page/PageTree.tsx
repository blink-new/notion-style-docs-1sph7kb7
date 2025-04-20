
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageStore } from '../../store/page';
import { Page } from '../../types';
import { Button } from '../ui/button';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '../ui/context-menu';
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
import { ChevronDown, ChevronRight, File, MoreHorizontal, Plus, Trash } from 'lucide-react';

interface PageTreeProps {
  pages: Page[];
  level?: number;
}

export default function PageTree({ pages, level = 0 }: PageTreeProps) {
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [parentPageId, setParentPageId] = useState<string | null>(null);
  const [isRenamePageOpen, setIsRenamePageOpen] = useState(false);
  const [pageToRename, setPageToRename] = useState<Page | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const { currentPage, setCurrentPage, createPage, updatePage, deletePage } = usePageStore();
  const navigate = useNavigate();

  const toggleExpand = (pageId: string) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageId]: !prev[pageId]
    }));
  };

  const handlePageClick = (page: Page) => {
    setCurrentPage(page);
    navigate(`/page/${page.id}`);
  };

  const handleCreateSubpage = (parentId: string) => {
    setParentPageId(parentId);
    setIsCreatePageOpen(true);
  };

  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !currentPage?.workspace_id) return;
    
    const newPage = await createPage(newPageTitle.trim(), currentPage.workspace_id, parentPageId);
    setNewPageTitle('');
    setIsCreatePageOpen(false);
    
    if (newPage) {
      // Expand the parent page
      if (parentPageId) {
        setExpandedPages(prev => ({
          ...prev,
          [parentPageId]: true
        }));
      }
      
      navigate(`/page/${newPage.id}`);
    }
  };

  const handleRenamePage = (page: Page) => {
    setPageToRename(page);
    setNewPageName(page.title);
    setIsRenamePageOpen(true);
  };

  const handleSaveRename = async () => {
    if (!pageToRename || !newPageName.trim()) return;
    
    await updatePage(pageToRename.id, { title: newPageName.trim() });
    setIsRenamePageOpen(false);
  };

  const handleDeletePage = async (pageId: string) => {
    if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      await deletePage(pageId);
      
      // If the deleted page is the current page, navigate to the first available page
      if (currentPage?.id === pageId) {
        const firstPage = usePageStore.getState().pages[0];
        if (firstPage) {
          navigate(`/page/${firstPage.id}`);
        } else {
          navigate('/');
        }
      }
    }
  };

  return (
    <div className="space-y-1">
      {pages.map((page) => (
        <div key={page.id} style={{ paddingLeft: `${level * 12}px` }}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="group flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => toggleExpand(page.id)}
                >
                  {page.children && page.children.length > 0 ? (
                    expandedPages[page.id] ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )
                  ) : (
                    <div className="w-4" />
                  )}
                </Button>
                
                <div
                  className={`flex flex-1 items-center rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    currentPage?.id === page.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                  }`}
                  onClick={() => handlePageClick(page)}
                >
                  <File size={14} className="mr-2 shrink-0" />
                  <span className="flex-1 truncate">{page.title}</span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateSubpage(page.id);
                    }}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => handleRenamePage(page)}>
                Rename
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreateSubpage(page.id)}>
                Add subpage
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => handleDeletePage(page.id)}
                className="text-red-500 focus:text-red-500"
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          
          {expandedPages[page.id] && page.children && page.children.length > 0 && (
            <PageTree pages={page.children} level={level + 1} />
          )}
        </div>
      ))}
      
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
      
      <Dialog open={isRenamePageOpen} onOpenChange={setIsRenamePageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Page</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="page-name">Page Title</Label>
            <Input
              id="page-name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}