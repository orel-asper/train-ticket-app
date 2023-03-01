import { useLayoutEffect, useState, useCallback } from 'react';
import dagre from 'dagre';
import {
  Node,
  Edge,
  Position,
} from 'reactflow';

type LayoutedNode = Node & {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutedEdge = Edge;

type Layout = {
  nodes: LayoutedNode[];
  edges: LayoutedEdge[];
};

const nodeWidth = 150;
const nodeHeight = 300;

const useDagreLayout = (nodes: Node[], edges: Edge[]): Layout => {
  const [layout, setLayout] = useState<Layout>({ nodes: [], edges: [] });


  const doLayout = useCallback(async () => {
    try {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
        return {
          ...node,
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
          width: nodeWidth,
          height: nodeHeight,
        };
      });
      const layoutedEdges = edges.map((edge) => {
        return {
          ...edge,
          type: 'simplebezier',
        };
      });

      setLayout({ nodes: layoutedNodes, edges: layoutedEdges });
    } catch (error) {
      console.error('An error occurred while laying out the graph:', error);
    }
  }, [nodes, edges]);

  return {
    nodes: layout.nodes,
    edges: layout.edges,
  }
};


export default useDagreLayout;