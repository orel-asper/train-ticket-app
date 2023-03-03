import {
    Node,
    Edge,
} from 'reactflow';
interface Vulnerability {
    file: string;
    severity: string;
    message: string;
    metadata: {
        cwe: string;
    }
}

interface NodeData {
    id: any;
    name: string;
    kind: string;
    language: string;
    path: string;
    publicExposed: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: any;
}

interface EdgeData {
    target: any;
    source: any;
    from: string;
    to: string[] | string;
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

interface Colors {
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
    [key: string]: string;
}

interface FilteredData {
    nodes: NodeData[];
    edges: EdgeData[];
};

interface FilterProps {
    handleFilterClick: (activeName: FilterType) => void,
    activeName: string
}

export type {
    Vulnerability,
    NodeData,
    EdgeData,
    GraphData,
    FlowGraph,
    Colors,
    FilteredData,
    FilterProps
};

export enum FilterType {
    KIND = 'Sink',
    VULNERABILITIES = 'Vulnerabilities',
    PUBLIC_EXPOSED = 'Public Exposed & Sink',
    ALL = 'All'
}
