import { useEffect, useState } from "react";
import train_data from "../services/train_data";
import { NodeData, EdgeData, FilterType, FilteredData } from "../interfaces/global";

const findStartingNodes = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    return nodes.filter((node) => (node.kind === 'sqs' || node.kind === 'rds') && !edges.some((edge) => edge.to === node.name));
};

const findVulnerableNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.hasOwnProperty('vulnerabilities'));
};

const findPublicExposedNodes = (nodes: NodeData[]): NodeData[] => {
    return nodes.filter((node) => node.publicExposed);
};

const findIncomingEdgesToNodes = (nodes: NodeData[], edges: EdgeData[], targetNodes: NodeData[]): EdgeData[] => {
    return edges.filter((edge) => {
        const targetNames = targetNodes.map((node) => node.name);
        return typeof edge.to === 'string'
            ? targetNames.includes(edge.to)
            : edge.to.some((to) => targetNames.includes(to));
    });
};

const findSourceNodesOfEdges = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
    const sourceNodes: NodeData[] = [];
    edges.forEach((edge) => {
        const sourceNode = nodes.find((node) => node.name === edge.from);
        if (sourceNode) {
            sourceNodes.push(sourceNode);
        }
    });
    return sourceNodes;
};

const traverseGraph = (startingNode: NodeData[], nodes: NodeData[], edges: EdgeData[]): { nodes: NodeData[]; edges: EdgeData[] } => {
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

    const edgePath = train_data.edges as EdgeData[];

    return { nodes: nodePath, edges: edgePath };
};

const removeDuplicates = (nodes: NodeData[], edges: EdgeData[]): { nodes: NodeData[]; edges: EdgeData[] } => {
    const uniqueNodes: NodeData[] = [];
    const uniqueEdges: EdgeData[] = [];

    nodes.filter((node) => {
        if (!uniqueNodes.some((uniqueNode) => uniqueNode.name === node.name)) {
            uniqueNodes.push(node);
        }
    });

    edges.filter((edge) => {
        if (
            !uniqueEdges.some(
                (uniqueEdge) =>
                    (uniqueEdge.from === edge.from && uniqueEdge.to === edge.to) ||
                    (uniqueEdge.from === edge.to && uniqueEdge.to === edge.from)
            )
        ) {
            uniqueEdges.push(edge);
        }
    });
    const uniqueData: FilteredData = { nodes: uniqueNodes, edges: uniqueEdges };
    return uniqueData;
};

const useGetFilteredData = (Filter: FilterType) => {
    const [filteredData, setFilteredData] = useState<any>(null);


    useEffect(() => {
        if (Filter === FilterType.KIND) {
            const startingNodes = findStartingNodes(
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[],
            );

            const { nodes, edges } = traverseGraph(
                startingNodes,
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[]
            );

            const filteredData: FilteredData = { nodes, edges };
            setFilteredData(removeDuplicates(filteredData.nodes, filteredData.edges));
        } else if (Filter === FilterType.VULNERABILITIES) {
            const vulnerableNodes = findVulnerableNodes(train_data.nodes as NodeData[]);

            const { nodes, edges } = traverseGraph(
                vulnerableNodes,
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[]
            );

            const filteredData: FilteredData = { nodes, edges };
            setFilteredData(removeDuplicates(filteredData.nodes, filteredData.edges));
        } else if (Filter === FilterType.PUBLIC_EXPOSED) {
            const publicExposedNodes = findPublicExposedNodes(train_data.nodes as NodeData[]);
            const { nodes, edges } = traverseGraph(
                publicExposedNodes,
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[]
            );

            const filteredData: FilteredData = { nodes, edges };
            setFilteredData(removeDuplicates(filteredData.nodes, filteredData.edges));
        } else if (Filter === FilterType.ALL) {
            setFilteredData(train_data);
        }
    }, [Filter]);
    console.log('filteredData', filteredData)
    return filteredData;
}

export default useGetFilteredData;
