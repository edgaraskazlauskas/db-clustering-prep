//@ts-check

const GraphEdge = require("./GraphEdge");

class GraphNode {
  /**
   * @type {String}
   * @private
   */
  name;

  /**
   * @type {GraphEdge[]}
   * @private
   */
  edges;

  /**
   * @param {String} name
   * @param {GraphEdge[]} edges - all edges (including repeated ones)
   */
  constructor(name, edges = []) {
    this.name = name;
    this.edges = edges;
  }

  getName() {
    return this.name;
  }

  getIncomingRelations() {
    // This should filter ALL edges of the table, not only edges of this node (outgoing)
    return this.edges.filter((edge) => edge.isDestination(this));
  }

  getOutgoingRelations() {
    return this.edges.filter((edge) => edge.isSource(this));
  }

  /**
   * @param {GraphEdge[]} edges
   */
  setEdges(edges) {
    this.edges = edges;
  }

  /**
   *
   * @param {String} name
   * @returns {Boolean}
   */
  isOf(name) {
    return this.name === name;
  }
}

module.exports = GraphNode;
