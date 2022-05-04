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
   * @param {GraphNode} sourceNode
   * @param {GraphNode} destinationNode
   */
  constructor(sourceNode, destinationNode) {
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;
  }

  calculate() {
    const srcOutgoingRelations = this.sourceNode.getOutgoingRelations();
    const destIncomingRelations = this.destinationNode.getIncomingRelations();

    let weight = 10;

    if (destIncomingRelations.length === 1) {
      // This is the only incoming relation of the destionation node
      weight += 15;
    }

    if (srcOutgoingRelations.length > 1) {
      // This is not the only outgoing relation of the source node
      srcOutgoingRelations.forEach((relation) => {
        // Penalize for each outgoing relation IF the destination has its own relations other than this one
        const destinationNode = relation.getDestinationNode();
        if (
          destinationNode.getOutgoingRelations().length > 0 ||
          destinationNode.getIncomingRelations().length > 1
        ) {
          weight -= 3;
        }
      });
    }

    if (weight <= 0) {
      // Weight must remain positive
      weight = 1;
    }

    return weight;
  }
}

module.exports = GraphEdgeWeight;
