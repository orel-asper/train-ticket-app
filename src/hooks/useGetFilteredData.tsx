import { useEffect, useState } from "react";
import train_data from "../services/train_data";
import {
    NodeData,
    EdgeData,
    FilterType,
    FilteredData,
} from "../interfaces/global";
import {
    findEndingSinkNodes,
    findVulnerableNodes,
    findPublicExposedNodes,
    traverseGraph,
    removeDuplicates,
    findRoutes,
} from "../utils/calc_filtered_data";

const useGetFilteredData = (Filter: FilterType) => {
    const [filteredData, setFilteredData] = useState<FilteredData | null>(null);

    const getFilteredData = (startingNodes: NodeData[]) => {
        const { nodes, edges } = traverseGraph(
            startingNodes,
            train_data.nodes as NodeData[],
            train_data.edges as EdgeData[]
        );

        const filteredData: FilteredData = { nodes, edges };
        return removeDuplicates(filteredData.nodes, filteredData.edges);
    };

    useEffect(() => {
        if (Filter === FilterType.KIND) {
            const startingNodes = findEndingSinkNodes(
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[]
            );
            setFilteredData(getFilteredData(startingNodes));
        } else if (Filter === FilterType.VULNERABILITIES) {
            const vulnerableNodes = findVulnerableNodes(
                train_data.nodes as NodeData[]
            );
            setFilteredData(getFilteredData(vulnerableNodes));
        } else if (Filter === FilterType.PUBLIC_EXPOSED) {
            const publicExposedNodes = findRoutes(
                findPublicExposedNodes(train_data.nodes as NodeData[]),
                findEndingSinkNodes(train_data.nodes as NodeData[], train_data.edges as EdgeData[]),
                train_data.nodes as NodeData[],
                train_data.edges as EdgeData[]
            );
            setFilteredData(publicExposedNodes);
        } else if (Filter === FilterType.ALL) {
            setFilteredData(train_data as FilteredData);
        }
    }, [Filter]);

    return filteredData;
};

export default useGetFilteredData;
