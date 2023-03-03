
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