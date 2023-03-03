import { NodeData, EdgeData, FilteredData } from "../interfaces/global";

export const findEndingSinkNodes = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    return nodes.filter((node) => (node.kind === 'sqs' || node.kind === 'rds') && !edges.some((edge) => edge.to === node.name));
};

export const findVulnerableNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.hasOwnProperty('vulnerabilities'));
};

export const findPublicExposedNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.publicExposed);
};

export const findIncomingEdgesToNodes = (edges: EdgeData[], targetNodes: NodeData[]): EdgeData[] => {
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

export const findOutboundEdgesFromNodes = (edges: EdgeData[], sourceNodes: NodeData[]): EdgeData[] => {
    return edges.filter((edge) => {
        const sourceNames = sourceNodes.map((node) => node.name);
        return sourceNames.includes(edge.from);
    });
};

export const findTargetNodesOfEdges = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    const targetNodes: NodeData[] = [];
    edges.forEach((edge) => {
        const edgeArr = typeof edge.to === 'string' ? [edge.to] : edge.to;
        edgeArr.map((toNode) => {
            const targetNode = nodes.find((node) => node.name === toNode);
            if (targetNode) {
                targetNodes.push(targetNode);
            }
        });
    });
    return targetNodes;
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

export const traverseGraph = (startingNode: NodeData[], nodes: NodeData[], edges: EdgeData[]): { nodes: NodeData[]; edges: EdgeData[] } => {
    let incomingNode: NodeData[] = startingNode;
    let outgoingNode: NodeData[] = startingNode;
    let nodePath: NodeData[] = [...startingNode];

    while (incomingNode.length > 0 || outgoingNode.length > 0) {
        const incomingEdges = findIncomingEdgesToNodes(edges, incomingNode);
        if (incomingEdges.length > 0) {
            const sourceNodes = findSourceNodesOfEdges(nodes, incomingEdges);
            if (sourceNodes.length > 0) {
                incomingNode = sourceNodes;
                nodePath.push(...sourceNodes);
                continue;
            } else break;
        }

        const outgoingEdges = findOutboundEdgesFromNodes(edges, outgoingNode);
        if (outgoingEdges.length > 0) {
            const targetNodes = findTargetNodesOfEdges(nodes, outgoingEdges);
            if (targetNodes.length > 0) {
                outgoingNode = targetNodes;
                nodePath.push(...targetNodes);
                continue;
            } else break;
        } else break;
    }
    return { nodes: nodePath, edges };
};

export const findRoutes = (startNodes: NodeData[], endNodes: NodeData[], nodes: NodeData[], edges: EdgeData[]): { nodes: NodeData[]; edges: EdgeData[] } => {
    const allNodes: NodeData[] = [];

    for (const startNode of startNodes) {
        for (const endNode of endNodes) {
            const visitedNodes = new Set<NodeData>();
            const nodeQueue: NodeData[][] = [[startNode]];

            while (nodeQueue.length > 0) {
                const path = nodeQueue.shift()!;
                const currentNode = path[path.length - 1];
                if (currentNode === endNode) {
                    allNodes.push(...path);
                }

                if (visitedNodes.has(currentNode)) continue;

                visitedNodes.add(currentNode);
                const outgoingEdges = findOutboundEdgesFromNodes(edges, [currentNode]);
                const targetNodes = findTargetNodesOfEdges(nodes, outgoingEdges);

                for (const targetNode of targetNodes) {
                    if (!visitedNodes.has(targetNode)) {
                        const newPath = [...path, targetNode];
                        nodeQueue.push(newPath);
                    }
                }
            }
        }
    }
    return { nodes: allNodes, edges };
};