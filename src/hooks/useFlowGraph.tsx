import { useEffect, useCallback } from 'react';
import {
    addEdge,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    MarkerType,
    Node,
    Edge,
} from 'reactflow';
import { GraphData, FlowGraph } from '../interfaces/global';
import { BLACK, RED, colors } from '../utils/constant';
import { NodeElementLabel } from '../components';
import calcLayout from '../utils/calc_layout';

const useFlowGraph = (graphData: GraphData): FlowGraph => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[]);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    useEffect(() => {
        const nodeElements = graphData.nodes.map((nodeData) => ({
            id: nodeData.name,
            data: { label: (<NodeElementLabel nodeData={nodeData} />) },
            style: {
                border: `5px solid ${colors[nodeData.language] || colors['default']}`,
                color: nodeData.publicExposed ? RED : BLACK,
                borderRadius: '10px',
                width: 'auto',
                fontSize: '18px',
                fontWeight: 'bold',
            },
            position: { x: 0, y: 0 },
        }));

        const edgeElements = graphData.edges.flatMap((edgeData) => {
            const targetNodes = typeof edgeData.to === 'string' ? [edgeData.to] : edgeData.to;

            return targetNodes.map((to, index) => ({
                id: `${edgeData.from}-${index}`,
                source: edgeData.from,
                target: to,
                animated: false,
                type: ConnectionLineType.SimpleBezier,
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 20,
                    height: 20,
                },
            }));
        });

        const edgeElementsWithExistingNodes = edgeElements.filter((edgeElement) => {
            const sourceNode = nodeElements.find((nodeElement) => nodeElement.id === edgeElement.source);
            const targetNode = nodeElements.find((nodeElement) => nodeElement.id === edgeElement.target);
            return sourceNode && targetNode;
        });

        const { nodes: updatedNodes, edges: updatedEdges } = calcLayout(nodeElements, edgeElementsWithExistingNodes, 'TB');

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    }, [graphData]);

    return { nodes, edges, onNodesChange, onEdgesChange, onConnect };
};

export default useFlowGraph;
