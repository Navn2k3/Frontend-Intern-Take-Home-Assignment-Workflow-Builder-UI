import { Zap, GitBranch, Square, Play, MousePointer, Trash2, Pencil } from 'lucide-react';

export const HelpPanel = () => {
  return (
    <div className="w-64 border-l border-border bg-card/30 p-4 overflow-auto">
      <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
        Node Types
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
          <div className="p-1.5 rounded bg-node-start/20">
            <Play className="w-4 h-4 text-node-start" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Start</h3>
            <p className="text-xs text-muted-foreground">Entry point of the workflow</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
          <div className="p-1.5 rounded bg-node-action/20">
            <Zap className="w-4 h-4 text-node-action" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Action</h3>
            <p className="text-xs text-muted-foreground">Single task with one output</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
          <div className="p-1.5 rounded bg-node-branch/20">
            <GitBranch className="w-4 h-4 text-node-branch" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Branch</h3>
            <p className="text-xs text-muted-foreground">Decision point with multiple outputs</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
          <div className="p-1.5 rounded bg-node-end/20">
            <Square className="w-4 h-4 text-node-end" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">End</h3>
            <p className="text-xs text-muted-foreground">Terminal node, no outputs</p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-foreground mt-6 mb-4 uppercase tracking-wide">
        Interactions
      </h2>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <MousePointer className="w-3 h-3" />
          <span>Click <kbd className="px-1 py-0.5 rounded bg-muted text-foreground">+</kbd> to add nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <Pencil className="w-3 h-3" />
          <span>Double-click label to edit</span>
        </div>
        <div className="flex items-center gap-2">
          <Trash2 className="w-3 h-3" />
          <span>Hover node to delete</span>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-foreground mt-6 mb-4 uppercase tracking-wide">
        Keyboard Shortcuts
      </h2>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Undo</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Ctrl+Z</kbd>
        </div>
        <div className="flex justify-between">
          <span>Redo</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Ctrl+Shift+Z</kbd>
        </div>
        <div className="flex justify-between">
          <span>Save</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Ctrl+S</kbd>
        </div>
      </div>
    </div>
  );
};
