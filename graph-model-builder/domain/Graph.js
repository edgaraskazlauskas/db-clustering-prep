//@ts-check

const GraphEdge = require("./GraphEdge");
const GraphNode = require("./GraphNode");

class Graph {
  /**
   * @param {Object[]} entities
   * @param {Object[]} relations
   */
  constructor(entities, relations) {
    this.nodes = entities.map((entity) => new GraphNode(entity.name));
    this.edges = relations.map(
      (relation) => new GraphEdge(relation.origin, relation.destination)
    );

    this.edges.forEach((edge) => {
      edge.setSourceNode(
        this.nodes.find((node) => node.isOf(edge.getSource()))
      );
      edge.setDestinationNode(
        this.nodes.find((node) => node.isOf(edge.getDestination()))
      );
    });

    this.nodes.forEach((node) => {
      node.setEdges(
        this.edges.filter((edge) => edge.isSourceOrDestination(node))
      );
    });
  }

  print() {
    this.edges.forEach((edge) => {
      console.log(
        `${edge.getSource()} -> ${edge.getDestination()}: ${edge.calculateWeight()}`
      );
    });
  }
}

module.exports = Graph;
