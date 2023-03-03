import { useEffect, useState } from "react";
import train_data from "../services/train_data";
import { NodeData, EdgeData } from "../interfaces/global";


const useGetFilteredData = (Filter: string) => {
    const [filteredData, setFilteredData] = useState<any>(null);

    const filterData = (data: { nodes: NodeData[]; edges: EdgeData[]; }) => {
        const { nodes, edges } = data;

        // Find the starting node(s) that match the filter
        const startingNodes = nodes.filter((node) => node.kind === Filter && !edges.some((edge) => edge.to === node.name));
        console.log('1:startingNodes - ', startingNodes)

        let filteredNodes: NodeData[] = [];
        let filteredEdges: EdgeData[] = [];

        // vulnerability: if the starting node is not found, the filteredNodes and filteredEdges will be empty
        const vulnerability = nodes.filter((node) => node.hasOwnProperty('vulnerabilities'));
        console.log('2:vulnerability - ', vulnerability)

        // Traverse the graph backwards from each starting node to the root node
        startingNodes.forEach((startingNode) => {
            let currentNode: NodeData[] = [startingNode];
            let nodePath: NodeData[] = [];

            while (currentNode.length > 0) {
                // Add the current node(s) to the nodePath
                nodePath.push(...currentNode);

                // Find the incoming edges to the current node(s)
                const incomingEdges = edges.filter((edge) => (
                    typeof edge.to === 'string' ? currentNode.some((node) => node.name === edge.to) : edge.to.some((to) => currentNode.some((node) => node.name === to))
                ));

                console.log('3:incomingEdges - ', incomingEdges)

                if (incomingEdges.length > 0) {
                    // Find the source nodes of the incoming edges
                    const sourceNodes: NodeData[] = [];
                    incomingEdges.forEach((edge) => {
                        //@ts-ignore
                        return sourceNodes.push(nodes.find((node) => node.name === edge.from));
                    });
                    console.log('4:sourceNodes - ', sourceNodes)

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

            // Add the nodes and edges in the nodePath to the filtered arrays
            filteredNodes.push(...nodePath);
            filteredEdges.push(
                ...nodePath.slice(0, -1).map((node, i) => {
                    return {
                        source: node.id,
                        target: nodePath[i + 1].id,
                        from: node.name,
                        to: nodePath[i + 1].name,
                    };
                })
            );
        });

        console.log('5:filteredNodes - ', filteredNodes)
        return [filteredNodes, filteredEdges];
    };



    useEffect(() => {
        if (Filter) {
            const [filteredNodes, filteredEdges] = filterData(train_data as any);
            setFilteredData([filteredNodes, filteredEdges]);
        }
    }, [Filter]);

    return filteredData;
}

export default useGetFilteredData;
