//@ts-check
const GraphEdge = require("./GraphEdge");

class GraphNode {
  /**
   * @property {String}
   * @private
   */
  name;

  /**
   * @property {GraphEdge[]}
   * @private
   */
  edges;

  /**
   * @param {String} name
   * @param {GraphEdge[]} edges
   */
  constructor(name, edges = []) {
    this.name = name;
    this.edges = edges;
  }

  getName() {
    return this.name;
  }

  getIncomingRelations() {
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
