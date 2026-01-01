import { useEffect } from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { Toolbar } from '@/components/workflow/Toolbar';
import { HelpPanel } from '@/components/workflow/HelpPanel';

const Index = () => {
  const {
    state,
    addNode,
    deleteNode,
    updateNodeLabel,
    undo,
    redo,
    canUndo,
    canRedo,
    saveWorkflow,
    resetWorkflow,
  } = useWorkflow();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveWorkflow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveWorkflow]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Toolbar */}
      <Toolbar
        onUndo={undo}
        onRedo={redo}
        onSave={saveWorkflow}
        onReset={resetWorkflow}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <WorkflowCanvas
          state={state}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onUpdateLabel={updateNodeLabel}
        />
        
        {/* Help panel */}
        <HelpPanel />
      </div>
    </div>
  );
};

export default Index;
