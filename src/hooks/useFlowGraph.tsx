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
import {
    GraphData,
    FlowGraph,
} from '../interfaces/global';
import { BLACK, RED, colors } from '../utils/constant';
import calcLayout from '../utils/calc_layout';
import NodeElementLabel from '../components/NodeElementLabel';

const useFlowGraph = (graphData: GraphData): FlowGraph => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[]);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    useEffect(() => {
        const nodeElements = graphData.nodes.map((nodeData) => {
            const color = nodeData.publicExposed ? RED : BLACK;
            const nodeElement = {
                id: nodeData.name,
                data: {
                    label: (<NodeElementLabel nodeData={nodeData} />),
                },
                style: {
                    border: `5px solid ${colors[nodeData.language] || colors['default']}`,
                    color: color,
                    borderRadius: '10px',
                    width: 'auto',
                    fontSize: '18px',
                    fontWeight: 'bold',
                },
                position: { x: 0, y: 0 },
            };
            return nodeElement;
        });

        const edgeElements: Edge[] = graphData.edges.flatMap((edgeData) => {
            if (typeof edgeData.to === 'string') {
                return [
                    {
                        id: edgeData.from,
                        source: edgeData.from,
                        target: edgeData.to,
                        animated: false,
                        type: ConnectionLineType.SimpleBezier,
                        markerEnd: {
                            type: MarkerType.Arrow,
                            width: 20,
                            height: 20,
                        },
                    },
                ];
            }
            return edgeData.to.map((to, index) => {
                return {
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
                };
            });
        });

        const { nodes, edges } = calcLayout(nodeElements, edgeElements, 'TB');

        setNodes(nodes);
        setEdges(edges);
    }, []);

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
    };
};

export default useFlowGraph;
