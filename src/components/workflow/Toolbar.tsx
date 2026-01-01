import { Undo2, Redo2, Save, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  onUndo,
  onRedo,
  onSave,
  onReset,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  const handleSave = () => {
    onSave();
    toast.success('Workflow saved to console!', {
      description: 'Check your browser console to see the workflow data.',
    });
  };

  const handleReset = () => {
    onReset();
    toast.info('Workflow reset to initial state');
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground mr-4">
          Workflow Builder
        </h1>
        
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-border pr-3 mr-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-md hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-md hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};
