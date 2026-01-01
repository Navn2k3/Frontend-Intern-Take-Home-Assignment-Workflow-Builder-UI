import { WorkflowState, WorkflowNode, NodeType } from '@/types/workflow';
import { WorkflowNodeComponent } from './WorkflowNode';
import { AddNodeButton } from './AddNodeButton';

interface WorkflowCanvasProps {
  state: WorkflowState;
  onAddNode: (parentId: string, type: NodeType, branchIndex?: number) => void;
  onDeleteNode: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
}

export const WorkflowCanvas = ({
  state,
  onAddNode,
  onDeleteNode,
  onUpdateLabel,
}: WorkflowCanvasProps) => {
  const renderNode = (nodeId: string, depth: number = 0): React.ReactNode => {
    const node = state.nodes[nodeId];
    if (!node) return null;

    const canAddChildren = node.type !== 'end';

    return (
      <div key={nodeId} className="flex flex-col items-center">
        {/* The node itself */}
        <div className="group">
          <WorkflowNodeComponent
            node={node}
            onDelete={onDeleteNode}
            onUpdateLabel={onUpdateLabel}
          />
        </div>

        {/* Children handling */}
        {node.type === 'branch' ? (
          // Branch node: render multiple children in a horizontal layout
          <div className="flex flex-col items-center">
            {/* Vertical line from node to horizontal bar */}
            <div className="w-0.5 h-8 bg-connection opacity-60" />
            
            {/* Horizontal connector bar */}
            <div className="relative">
              <div 
                className="h-0.5 bg-connection opacity-60"
                style={{
                  width: `${Math.max(2, (node.branchLabels?.length || 2)) * 220}px`,
                }}
              />
              
              {/* Branch children */}
              <div className="flex justify-around absolute -top-0 left-0 right-0">
                {(node.branchLabels || ['True', 'False']).map((label, index) => (
                  <div key={index} className="flex flex-col items-center" style={{ width: '220px' }}>
                    {/* Vertical line down from horizontal bar */}
                    <div className="w-0.5 h-4 bg-connection opacity-60" />
                    
                    {/* Branch label */}
                    <span className="branch-label my-2 animate-fade-in">
                      {label}
                    </span>
                    
                    {/* Child node or add button */}
                    {node.children[index] ? (
                      <>
                        <div className="w-0.5 h-4 bg-connection opacity-60" />
                        {renderNode(node.children[index], depth + 1)}
                      </>
                    ) : (
                      <AddNodeButton
                        onAdd={(type) => onAddNode(nodeId, type, index)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Spacer for the branch content */}
            <div className="h-48" />
          </div>
        ) : canAddChildren ? (
          // Start/Action nodes: single child
          <>
            {node.children.length > 0 ? (
              <>
                <div className="w-0.5 h-8 bg-connection opacity-60" />
                {renderNode(node.children[0], depth + 1)}
              </>
            ) : (
              <AddNodeButton
                onAdd={(type) => onAddNode(nodeId, type)}
              />
            )}
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto canvas-grid p-8">
      <div className="min-h-full flex flex-col items-center py-12">
        {renderNode(state.rootId)}
      </div>
    </div>
  );
};
