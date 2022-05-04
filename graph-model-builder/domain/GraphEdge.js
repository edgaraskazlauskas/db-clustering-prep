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
   * @param {GraphNode} sourceNode
   * @param {GraphNode} destinationNode
   */
  constructor(source, destination, sourceNode = null, destinationNode = null) {
    this.source = source;
    this.destination = destination;

    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;
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

  getSourceNode() {
    return this.sourceNode;
  }

  getDestinationNode() {
    return this.destinationNode;
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
