import { NodeData, EdgeData, FilteredData } from "../interfaces/global";

export const findStartingNodes = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    return nodes.filter((node) => (node.kind === 'sqs' || node.kind === 'rds') && !edges.some((edge) => edge.to === node.name));
};

export const findVulnerableNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.hasOwnProperty('vulnerabilities'));
};

export const findPublicExposedNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.publicExposed);
};

export const findIncomingEdgesToNodes = (nodes: NodeData[], edges: EdgeData[], targetNodes: NodeData[]): EdgeData[] => {
    return edges.filter((edge) => {
        const targetNames = targetNodes.map((node) => node.name);
        return typeof edge.to === 'string'
            ? targetNames.includes(edge.to)
            : edge.to.some((to) => targetNames.includes(to));
    });
};

export const findSourceNodesOfEdges = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    const sourceNodes: NodeData[] = [];
    edges.forEach((edge) => {
        const sourceNode = nodes.find((node) => node.name === edge.from);
        if (sourceNode) {
            sourceNodes.push(sourceNode);
        }
    });
    return sourceNodes;
};

export const traverseGraph = (startingNode: NodeData[], nodes: NodeData[], edges: EdgeData[]): { nodes: NodeData[]; edges: EdgeData[] } => {
    let currentNode: NodeData[] = startingNode;
    let nodePath: NodeData[] = [];

    while (currentNode.length > 0) {
        // Add the current node(s) to the nodePath
        nodePath.push(...currentNode);

        // Find the incoming edges to the current node(s)
        const incomingEdges = findIncomingEdgesToNodes(nodes, edges, currentNode);

        if (incomingEdges.length > 0) {
            // Find the source nodes of the incoming edges
            const sourceNodes = findSourceNodesOfEdges(nodes, incomingEdges);

            if (sourceNodes.length > 0) {
                // Move to the source nodes and continue traversal
                currentNode = sourceNodes;
            } else {
                // Source nodes not found, stop traversal
                break;
            }
        } else {
            // No incoming edges, stop traversal
            break;
        }
    }

    // Reverse the nodePath to get the correct order
    nodePath.reverse();

    return { nodes: nodePath, edges };
};

export const removeDuplicates = (nodes: NodeData[], edges: EdgeData[]): FilteredData => {
    const uniqueNodes = nodes.filter((node, index) => {
        const firstIndex = nodes.findIndex((n) => n.name === node.name);
        return firstIndex === index;
    });

    const uniqueEdges = edges.filter((edge, index) => {
        const fromTo = edge.from + '|' + edge.to;
        const toFrom = edge.to + '|' + edge.from;
        const firstIndex = edges.findIndex((e) => e.from + '|' + e.to === fromTo || e.from + '|' + e.to === toFrom);
        return firstIndex === index;
    });

    return { nodes: uniqueNodes, edges: uniqueEdges };
};
