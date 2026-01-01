import { useState, useRef, useEffect } from 'react';
import { WorkflowNode as NodeType, NodeType as NodeTypeEnum } from '@/types/workflow';
import { Play, Zap, GitBranch, Square, Trash2, Pencil, Check, X } from 'lucide-react';

interface WorkflowNodeProps {
  node: NodeType;
  onDelete: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
}

const nodeIcons: Record<NodeTypeEnum, React.ReactNode> = {
  start: <Play className="w-4 h-4" />,
  action: <Zap className="w-4 h-4" />,
  branch: <GitBranch className="w-4 h-4" />,
  end: <Square className="w-4 h-4" />,
};

const nodeTypeLabels: Record<NodeTypeEnum, string> = {
  start: 'Start',
  action: 'Action',
  branch: 'Condition',
  end: 'End',
};

export const WorkflowNodeComponent = ({
  node,
  onDelete,
  onUpdateLabel,
}: WorkflowNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editValue.trim()) {
      onUpdateLabel(node.id, editValue.trim());
    } else {
      setEditValue(node.label);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(node.label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="workflow-node animate-scale-in min-w-[180px] max-w-[240px]">
      {/* Type indicator bar */}
      <div className={`node-indicator node-indicator-${node.type}`} />
      
      <div className="p-4 pl-5">
        {/* Header with type badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-node-${node.type}`}>
              {nodeIcons[node.type]}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {nodeTypeLabels[node.type]}
            </span>
          </div>
          
          {/* Actions */}
          {node.type !== 'start' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded hover:bg-secondary transition-colors"
                    title="Edit label"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete(node.id)}
                    className="p-1 rounded hover:bg-destructive/20 transition-colors"
                    title="Delete node"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Label */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              className="flex-1 bg-input border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleSubmit}
              className="p-1 rounded hover:bg-primary/20 transition-colors"
            >
              <Check className="w-3 h-3 text-primary" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded hover:bg-destructive/20 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <h3 
            className="font-medium text-card-foreground truncate cursor-text"
            onDoubleClick={() => node.type !== 'start' && setIsEditing(true)}
            title={node.label}
          >
            {node.label}
          </h3>
        )}
      </div>
    </div>
  );
};
