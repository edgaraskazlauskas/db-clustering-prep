//@ts-check

const fs = require("fs");
const csvWriter = require("csv-writer");

const Graph = require("./Graph");

class GraphCsvWriter {
  /**
   * @param {String} name
   * @param {Graph} graph
   */
  constructor(name, graph) {
    this.name = name;
    this.graph = graph;

    this.nodesWriter = csvWriter.createObjectCsvWriter({
      path: `outputs/${name}-nodes.csv`,
      header: [
        { id: "id", title: "id" },
        { id: "id", title: "label" },
      ],
    });
    this.edgesWriter = csvWriter.createObjectCsvWriter({
      path: `outputs/${name}-edges.csv`,
      header: [
        { id: "source", title: "source" },
        { id: "destination", title: "destination" },
        { id: "weight", title: "weight" },
      ],
    });
  }

  async write() {
    try {
      fs.mkdirSync("outputs");
    } catch (e) {
      // ignore
    }

    await Promise.all([
      this.nodesWriter
        .writeRecords(
          this.graph.nodes.map((node) => ({
            id: node.getName(),
          }))
        )
        .then(() => {
          console.log("...Done writing nodes");
        }),
      this.edgesWriter
        .writeRecords(
          this.graph.edges.map((edge) => ({
            source: edge.getSource(),
            destination: edge.getDestination(),
            weight: edge.getWeight(),
          }))
        )
        .then(() => {
          console.log("...Done writing edges");
        }),
    ]);
  }
}

module.exports = GraphCsvWriter;
