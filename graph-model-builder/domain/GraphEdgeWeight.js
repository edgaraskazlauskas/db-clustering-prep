//@ts-check

const GraphNode = require("./GraphNode");

class GraphEdgeWeight {
  /**
   * @property {GraphNode}
   * @private
   */
  sourceNode;

  /**
   * @property {GraphNode}
   * @private
   */
  destinationNode;

  /**
   * @property {number}
   * @private
   */
  weight;

  /**
   * @param {GraphNode} sourceNode
   * @param {GraphNode} destinationNode
   */
  constructor(sourceNode, destinationNode) {
    this.weight = 0;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;
  }

  calculate() {
    const srcOutgoingRelations = this.sourceNode.getOutgoingRelations();
    const destIncomingRelations = this.destinationNode.getIncomingRelations();

    this.weight += 10;

    if (destIncomingRelations.length === 1) {
      this.weight += 15;
    }

    if (srcOutgoingRelations.length > 1) {
      srcOutgoingRelations.forEach((relation) => {
        // how many relations does this relation have? if none, maybe it doesn't link to another cluster and we shouldnt penalize it
        const destinationNode = relation.getDestinationNode();
        if (
          destinationNode.getOutgoingRelations().length > 0 ||
          destinationNode.getIncomingRelations().length > 1
        ) {
          this.weight -= 3;
        }
      });
    }

    if (this.weight <= 0) {
      this.weight = 1;
    }

    return this.weight;
  }
}

module.exports = GraphEdgeWeight;
