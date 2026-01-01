import { useState, useRef, useEffect } from 'react';
import { Plus, Zap, GitBranch, Square } from 'lucide-react';
import { NodeType } from '@/types/workflow';

interface AddNodeButtonProps {
  onAdd: (type: NodeType) => void;
  branchLabel?: string;
  disabled?: boolean;
}

export const AddNodeButton = ({ onAdd, branchLabel, disabled }: AddNodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (disabled) {
    return null;
  }

  const handleAdd = (type: NodeType) => {
    onAdd(type);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center" ref={menuRef}>
      {/* Connection line segment above */}
      <div className="w-0.5 h-6 bg-connection opacity-60" />
      
      {/* Branch label if present */}
      {branchLabel && (
        <span className="branch-label mb-2 animate-fade-in">
          {branchLabel}
        </span>
      )}
      
      {/* Add button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="add-node-button z-10"
        title="Add node"
      >
        <Plus className="w-4 h-4" />
      </button>
      
      {/* Connection line segment below */}
      <div className="w-0.5 h-6 bg-connection opacity-60" />
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="context-menu absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <button
            onClick={() => handleAdd('action')}
            className="context-menu-item w-full"
          >
            <Zap className="w-4 h-4 text-node-action" />
            <span>Action</span>
          </button>
          <button
            onClick={() => handleAdd('branch')}
            className="context-menu-item w-full"
          >
            <GitBranch className="w-4 h-4 text-node-branch" />
            <span>Branch</span>
          </button>
          <button
            onClick={() => handleAdd('end')}
            className="context-menu-item w-full"
          >
            <Square className="w-4 h-4 text-node-end" />
            <span>End</span>
          </button>
        </div>
      )}
    </div>
  );
};
