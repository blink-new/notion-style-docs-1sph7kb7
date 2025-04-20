
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useWorkspaceStore } from '../../store/workspace';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
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
import { ChevronDown, LogOut, Plus, Settings, User } from 'lucide-react';

interface HeaderProps {
  onLogin: () => void;
}

export default function Header({ onLogin }: HeaderProps) {
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const { user, signOut } = useAuthStore();
  const { workspaces, currentWorkspace, createWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      await createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setIsCreateWorkspaceOpen(false);
    }
  };

  const handleWorkspaceChange = (workspace: typeof workspaces[0]) => {
    setCurrentWorkspace(workspace);
    navigate('/');
  };

  return (
    <header className="border-b bg-background px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">Notion Docs</h1>
          
          {user && currentWorkspace && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {currentWorkspace.name}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {workspaces.map((workspace) => (
                  <DropdownMenuItem 
                    key={workspace.id}
                    onClick={() => handleWorkspaceChange(workspace)}
                    className={workspace.id === currentWorkspace.id ? 'bg-accent' : ''}
                  >
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCreateWorkspaceOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onLogin}>Login</Button>
          )}
        </div>
      </div>
      
      <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="My Workspace"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateWorkspace}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}