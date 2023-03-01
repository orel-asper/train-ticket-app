import { useEffect, useCallback } from 'react';
import {
    addEdge,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    Position,
    ConnectionLineType,
    MarkerType,
} from 'reactflow';
import dagre from 'dagre';

interface Vulnerability {
    file: string;
    severity: string;
    message: string;
    metadata: {
        cwe: string;
    }
}

interface NodeData {
    name: string;
    kind: string;
    language: string;
    path: string;
    publicExposed: boolean;
    vulnerabilities?: Vulnerability[];
}

interface EdgeData {
    from: string;
    to: string[];
}

interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}

interface FlowGraph {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: any
    onEdgesChange: any
    onConnect: any
}

interface LanguageColors {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    csharp: string;
    ruby: string;
    go: string;
    php: string;
    scala: string;
    kotlin: string;
    swift: string;
    rust: string;
    default: string;
    [key: string]: string; // Add an index signature to allow any string index
}

const colors: LanguageColors = {
    javascript: "#f0db4f",
    typescript: "#007acc",
    python: "#3572A5",
    java: "#b07219",
    csharp: "#178600",
    ruby: "#CC342D",
    go: "#00ADD8",
    php: "#4F5D95",
    scala: "#DC322F",
    kotlin: "#A97BFF",
    swift: "#FFAC45",
    rust: "#DEA584",
    default: "#000000"
};


const nodeWidth = window.innerWidth / 8;
const nodeHeight = window.innerHeight / 3;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const doLayout = (nodes: Node[], edges: Edge[], direction: string) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const useFlowGraph = (graphData: GraphData): FlowGraph => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[]);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    useEffect(() => {
        const nodeElements = graphData.nodes.map((nodeData) => {
            const color = nodeData.publicExposed ? '#fff' : '#cfcfcf';
            const vulnerabilities = nodeData?.vulnerabilities?.map((vulnerability, index) => (
                <li key={index}>{vulnerability.message}</li>
            ));

            const nodeElement = {
                id: nodeData.name,
                data: {
                    label: (
                        <div>
                            <h1>{nodeData.name}</h1>
                            <p>{nodeData.kind}</p>
                            <p>{nodeData.language}</p>
                            <ul>{vulnerabilities}</ul>
                        </div>
                    ),
                },
                style: {
                    background: colors[nodeData.language] || colors['default'],
                    color: color,
                    fontSize: '18px',
                    fontWeight: 'bold',
                },
                position: { x: 0, y: 0 },
            };
            return nodeElement;
        });

        const assignedColors: string[] = [];

        const edgeColorsArray = graphData.edges.map((edgeData) => {
            let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
            while (assignedColors.includes(color)) {
                color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
            }
            assignedColors.push(color);
            return { from: edgeData.from, color: color };
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
                            color: edgeColorsArray.find((color) => color.from === edgeData.from)?.color,
                        },
                        style: {
                            stroke: edgeColorsArray.find((color) => color.from === edgeData.from)?.color,
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
                        color: edgeColorsArray.find((color) => color.from === edgeData.from)?.color,
                    },
                    style: {
                        stroke: edgeColorsArray.find((color) => color.from === edgeData.from)?.color,
                    },
                };
            });
        });

        const { nodes, edges } = doLayout(nodeElements, edgeElements, 'TB');

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
