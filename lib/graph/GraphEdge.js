//@ts-check

const Graph = require("./Graph");
const GraphNode = require("./GraphNode");
const GraphEdgeWeight = require("./GraphEdgeWeight");

class GraphEdge {
  /**
   * @type {String}
   * @private
   */
  source;

  /**
   * @type {String}
   * @private
   */
  destination;

  /**
   * @type {GraphEdgeWeight}
   * @private
   */
  weight;

  /**
   * @type {Graph}
   * @private
   */
  graph;

  /**
   * @param {String} source
   * @param {String} destination
   * @param {GraphEdgeWeight} weight
   */
  constructor(source, destination, weight) {
    this.source = source;
    this.destination = destination;
    this.weight = weight;
  }

  getWeight() {
    return this.weight.value;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  /**
   * @param {Graph} graph
   */
  setGraph(graph) {
    this.graph = graph;
  }

  /**
   * @param {GraphNode} node
   */
  isDestination(node) {
    return this.destination === node.getName();
  }

  /**
   * @param {GraphNode} node
   */
  isSource(node) {
    return this.source === node.getName();
  }
}

module.exports = GraphEdge;
