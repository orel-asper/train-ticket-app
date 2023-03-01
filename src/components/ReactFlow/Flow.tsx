import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  //interfaces
  Edge,
  Node,
  ConnectionLineType,
} from 'reactflow';
// ------- test code -------
import train_data from '../../services/train_data'
import useFlowGraph from '../../hooks/useFlowGraph';
// ------- test code -------
import 'reactflow/dist/style.css';
import './flow.css';

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

const Flow: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowGraph(train_data as any);


  const edgesWithUpdatedTypes: Edge[] = edges.map((edge: Edge) => {
    if (edge.sourceHandle) {
      const edgeSourceNode: Node = nodes?.find((node: Node) => node.id === edge.source) as Node;
      const edgeType: string = edgeSourceNode?.data?.selects[edge.sourceHandle];
      edge.type = edgeType;
    }

    return edge;
  });


  return (
    <div className="flow">
      <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};


export default Flow;