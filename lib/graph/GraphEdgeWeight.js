//@ts-check

class GraphEdgeWeight {
  /**
   * @type {Number}
   */
  value;

  /**
   * @param {Number} value
   */
  constructor(value) {
    if (isNaN(value) || value <= 0) {
      throw new Error("Graph edge weight must be a positive number!");
    }

    this.value = value;
  }
}

module.exports = GraphEdgeWeight;
