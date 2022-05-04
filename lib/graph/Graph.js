//@ts-check

const GraphEdge = require("./GraphEdge");
const GraphNode = require("./GraphNode");

class Graph {
  /**
   * @param {GraphNode[]} nodes
   * @param {GraphEdge[]} edges
   */
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;

    this.edges.forEach((edge) => this.registerEdge(edge));
    this.nodes.forEach((node) => this.registerNode(node));
  }

  /**
   * @param {GraphEdge} edge
   */
  registerEdge(edge) {
    edge.setGraph(this);
  }

  /**
   *
   * @param {String} name
   * @returns {GraphNode}
   */
  getNode(name) {
    return this.nodes.find((node) => node.isOf(name));
  }

  /**
   * @param {GraphNode} node
   */
  registerNode(node) {
    node.setEdges(
      this.edges.filter(
        (edge) => edge.isSource(node) || edge.isDestination(node)
      )
    );
  }
}

module.exports = Graph;
