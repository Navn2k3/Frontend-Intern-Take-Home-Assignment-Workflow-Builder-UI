import { useState, useCallback } from 'react';
import { WorkflowState, WorkflowNode, NodeType } from '@/types/workflow';

const generateId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const createInitialState = (): WorkflowState => {
  const startId = generateId();
  return {
    nodes: {
      [startId]: {
        id: startId,
        type: 'start',
        label: 'Start',
        children: [],
      },
    },
    rootId: startId,
  };
};

export const useWorkflow = () => {
  const [state, setState] = useState<WorkflowState>(createInitialState);
  const [history, setHistory] = useState<WorkflowState[]>([]);
  const [futureHistory, setFutureHistory] = useState<WorkflowState[]>([]);

  const saveToHistory = useCallback((currentState: WorkflowState) => {
    setHistory(prev => [...prev.slice(-19), currentState]);
    setFutureHistory([]);
  }, []);

  const addNode = useCallback((
    parentId: string,
    type: NodeType,
    branchIndex?: number
  ) => {
    setState(prevState => {
      saveToHistory(prevState);
      
      const newNodeId = generateId();
      const parent = prevState.nodes[parentId];
      
      if (!parent) return prevState;
      
      // Can't add to end nodes
      if (parent.type === 'end') return prevState;

      const newNode: WorkflowNode = {
        id: newNodeId,
        type,
        label: type === 'action' ? 'New Action' : type === 'branch' ? 'Condition' : 'End',
        children: type === 'branch' ? [] : [],
        branchLabels: type === 'branch' ? ['True', 'False'] : undefined,
      };

      let updatedParent: WorkflowNode;

      if (parent.type === 'branch' && branchIndex !== undefined) {
        // Adding to a specific branch
        const newChildren = [...parent.children];
        // Insert at specific branch position if empty, or connect to existing
        if (newChildren[branchIndex] === undefined) {
          newChildren[branchIndex] = newNodeId;
        } else {
          // Insert between parent and existing child
          const existingChild = newChildren[branchIndex];
          newChildren[branchIndex] = newNodeId;
          newNode.children = [existingChild];
        }
        updatedParent = { ...parent, children: newChildren };
      } else if (parent.type === 'start' || parent.type === 'action') {
        // Linear connection
        if (parent.children.length > 0) {
          // Insert between parent and existing child
          newNode.children = [...parent.children];
        }
        updatedParent = { ...parent, children: [newNodeId] };
      } else {
        return prevState;
      }

      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          [parentId]: updatedParent,
          [newNodeId]: newNode,
        },
      };
    });
  }, [saveToHistory]);

  const addBranch = useCallback((nodeId: string) => {
    setState(prevState => {
      saveToHistory(prevState);
      
      const node = prevState.nodes[nodeId];
      if (!node || node.type !== 'branch') return prevState;

      const newLabels = [...(node.branchLabels || []), `Branch ${(node.branchLabels?.length || 0) + 1}`];
      
      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          [nodeId]: {
            ...node,
            branchLabels: newLabels,
          },
        },
      };
    });
  }, [saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    setState(prevState => {
      saveToHistory(prevState);
      
      const node = prevState.nodes[nodeId];
      if (!node || node.type === 'start') return prevState;

      // Find parent
      let parentId: string | null = null;
      let branchIndex: number | undefined;
      
      for (const [id, n] of Object.entries(prevState.nodes)) {
        const childIndex = n.children.indexOf(nodeId);
        if (childIndex !== -1) {
          parentId = id;
          branchIndex = n.type === 'branch' ? childIndex : undefined;
          break;
        }
      }

      if (!parentId) return prevState;

      const parent = prevState.nodes[parentId];
      const newNodes = { ...prevState.nodes };
      
      // Connect parent to deleted node's children
      if (parent.type === 'branch' && branchIndex !== undefined) {
        const newChildren = [...parent.children];
        // If deleted node has children, connect first child to parent
        newChildren[branchIndex] = node.children[0] || '';
        // Remove empty string entries
        if (!newChildren[branchIndex]) {
          newChildren[branchIndex] = undefined as any;
        }
        newNodes[parentId] = { ...parent, children: newChildren.filter(c => c) };
      } else {
        newNodes[parentId] = { ...parent, children: node.children };
      }

      // Remove the node
      delete newNodes[nodeId];

      return {
        ...prevState,
        nodes: newNodes,
      };
    });
  }, [saveToHistory]);

  const updateNodeLabel = useCallback((nodeId: string, label: string) => {
    setState(prevState => {
      const node = prevState.nodes[nodeId];
      if (!node) return prevState;

      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          [nodeId]: { ...node, label },
        },
      };
    });
  }, []);

  const updateBranchLabel = useCallback((nodeId: string, branchIndex: number, label: string) => {
    setState(prevState => {
      const node = prevState.nodes[nodeId];
      if (!node || node.type !== 'branch' || !node.branchLabels) return prevState;

      const newLabels = [...node.branchLabels];
      newLabels[branchIndex] = label;

      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          [nodeId]: { ...node, branchLabels: newLabels },
        },
      };
    });
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setFutureHistory(prev => [state, ...prev]);
    setState(previous);
  }, [history, state]);

  const redo = useCallback(() => {
    if (futureHistory.length === 0) return;
    
    const next = futureHistory[0];
    setFutureHistory(prev => prev.slice(1));
    setHistory(prev => [...prev, state]);
    setState(next);
  }, [futureHistory, state]);

  const saveWorkflow = useCallback(() => {
    console.log('=== Workflow Data ===');
    console.log(JSON.stringify(state, null, 2));
    return state;
  }, [state]);

  const resetWorkflow = useCallback(() => {
    saveToHistory(state);
    setState(createInitialState());
  }, [saveToHistory, state]);

  return {
    state,
    addNode,
    addBranch,
    deleteNode,
    updateNodeLabel,
    updateBranchLabel,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: futureHistory.length > 0,
    saveWorkflow,
    resetWorkflow,
  };
};
