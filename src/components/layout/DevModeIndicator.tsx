
import { useDevMode } from '../../lib/dev-mode';
import { Button } from '../ui/button';

export default function DevModeIndicator() {
  const { isDevMode, deactivateDevMode } = useDevMode();
  
  if (!isDevMode) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-800 shadow-md">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
        <span className="font-medium">Development Mode</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2 h-6 border-yellow-300 bg-yellow-50 px-2 text-xs hover:bg-yellow-200"
        onClick={deactivateDevMode}
      >
        Exit
      </Button>
    </div>
  );
}