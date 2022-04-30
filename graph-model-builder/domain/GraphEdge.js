//@ts-check
const GraphEdgeWeight = require("./GraphEdgeWeight");
const GraphNode = require("./GraphNode");

class GraphEdge {
  /**
   * @property {String}
   * @private
   */
  source;

  /**
   * @property {String}
   * @private
   */
  destination;

  /**
   * @property {GraphNode}
   * @private
   */
  destinationNode;

  /**
   * @property {GraphNode}
   * @private
   */
  sourceNode;

  /**
   * @param {String} source
   * @param {String} destination
   */
  constructor(source, destination) {
    this.source = source;
    this.destination = destination;

    this.sourceNode = null;
    this.destinationNode = null;
  }

  getWeight() {
    return this.calculateWeight();
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  /**
   * @param {GraphNode} node
   */
  setSourceNode(node) {
    this.sourceNode = node;
  }

  /**
   * @param {GraphNode} node
   */
  setDestinationNode(node) {
    this.destinationNode = node;
  }

  /**
   * @param {GraphNode} node
   */
  isDestination(node) {
    return this.destinationNode === node;
  }

  /**
   * @param {GraphNode} node
   */
  isSource(node) {
    return this.sourceNode === node;
  }

  /**
   * @param {GraphNode} node
   */
  isSourceOrDestination(node) {
    return this.sourceNode === node || this.destinationNode === node;
  }

  calculateWeight() {
    const weight = new GraphEdgeWeight(
      this.sourceNode,
      this.destinationNode
    ).calculate();
    return weight;
  }
}

module.exports = GraphEdge;
