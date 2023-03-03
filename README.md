
### [](#header-3)The following are the steps to build the application:

1. Create a React App
2. Implement a basic page template with a header, footer, toolbar, and a main page
3. Load the provided JSON file that represents the Train Ticket micro-services graph
4. Choose a graph library and use it to show the entire graph on the main page
5. Use the "language" attribute of each node to display nodes in different colors or shapes based on their language
6. Identify and visually indicate services with vulnerabilities
7. Implement filtering options to show routes that meet certain criteria, such as ending in a Sink, having vulnerabilities, or starting in a public service and ending in a Sink
8. Implement basic query functionality on top of the graph to allow users to interact with the data and get more information about services and routes
9. Write a README file that explains your decisions and assumptions in developing the solution
10. Submit the completed project as a TypeScript git repo.

### [](#header-3) Graph Visualizer
Graph Visualizer is a React application that allows users to visualize directed acyclic graphs. 
It uses the dagre library to perform the layout of the graph.

### [](#header-3) Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm start` to start the application
4. Navigate to `http://localhost:3000/` to view the application

### [](#header-3) About the application

root--|</br>
******| -- src </br>
************| -- components</br>
********************| -- ReactFlow</br>
********************| -- Flow.tsx</br>
****************| -- Filter.tsx</br>
****************| -- Footer.tsx</br>
****************| -- NavBar.tsx</br>
****************| -- NodeElementLabel.tsx</br>   
************| -- hooks</br>
****************| -- useFlowGraph.tsx</br>
****************| -- useGetFilteredData.tsx</br>
************| -- services </br>
****************| -- train_data.ts</br>
************| -- interfaces</br>
****************| -- global.ts</br>
************| -- utils</br>
****************| -- calc_filtered_data.ts</br>
****************| -- calc_layout.ts</br>
****************| -- constant.ts</br>
************| -- App.tsx</br>
************| -- index.tsx</br>
      
short description of each file:

* Flow.tsx: React component responsible for rendering the main graph and handling user interactions.

* Filter.tsx: React component responsible for rendering the filter section where users can filter the nodes in the graph based on certain criteria.

* Footer.tsx: React component responsible for rendering the footer section of the app.

* NavBar.tsx: React component responsible for rendering the navigation bar at the top of the app.

* NodeElementLabel.tsx: React component responsible for rendering the label of a node in the graph.

* useFlowGraph.tsx: Custom React hook that encapsulates the logic for creating and updating the nodes and edges in the graph.

* useGetFilteredData.tsx: Custom React hook that encapsulates the logic for filtering the data based on user input.

* train_data.ts: Service file that contains the data used to populate the graph.

* global.ts: Interface file that defines the types used throughout the app.

* calc_filtered_data.ts: Utility functions responsible for filtering the data based on user input.

* calc_layout.ts: Utility functions responsible for calculating the layout of the nodes in the graph.

* constant.ts: File that contains constant values used throughout the app.

* App.tsx: Main React component that renders the entire app.

* index.tsx: Entry point of the app.


### [](#header-3) Explenation on the hard parts

calc_filtered_data file:

- findEndingSinkNodes: Finds all nodes that are of type 'sqs' or 'rds' and have no outgoing edges.

- findVulnerableNodes: Finds all nodes that have a property named 'vulnerabilities'.

- findPublicExposedNodes: Finds all nodes that have the boolean property 'publicExposed' set to true.

- findIncomingEdgesToNodes: Finds all edges that connect to a set of target nodes.

- findSourceNodesOfEdges: Given a set of edges, finds all nodes that are the source of the edges.

- findOutboundEdgesFromNodes: Finds all edges that originate from a set of source nodes.

- findTargetNodesOfEdges: Given a set of edges, finds all nodes that are the target of the edges.

- removeDuplicates: Removes duplicates from a set of nodes and edges.

- traverseGraph: Traverses a graph starting from a set of starting nodes, following incoming and outgoing edges to discover new nodes, until there are no more incoming or outgoing edges.

- findRoutes: Finds all possible routes between a set of starting nodes and a set of ending nodes, using a breadth-first search algorithm.

### [](#header-3) Notes

- Custom edge was added to the train_data to connect the node with a prop of publicExposed=true to a Sink node. 
This was done to test the functionality of the filter.

### [](#header-3) Final thoughts

wasn't easy to acieve but I'm happy with the result. I learned a lot about graph visualization and graph algorithms. I'm looking forward to hearing your feedback.
