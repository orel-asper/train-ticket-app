import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import { GRAY, minimapStyle } from '../../utils/constant';
import useFlowGraph from '../../hooks/useFlowGraph';
import 'reactflow/dist/style.css';
import './flow.css';

const Flow: React.FC<{ data: any }> = ({ data }) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowGraph(data);

  return (
    <div className="flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color={GRAY} gap={16} />
      </ReactFlow>
    </div>
  );
};

export default Flow;