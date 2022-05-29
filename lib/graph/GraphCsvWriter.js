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
      path: `build/outputs/${name}-nodes.csv`,
      header: [
        { id: "id", title: "id" },
        { id: "id", title: "label" },
      ],
    });
    this.edgesWriter = csvWriter.createObjectCsvWriter({
      path: `build/outputs/${name}-edges.csv`,
      header: [
        { id: "source", title: "source" },
        { id: "target", title: "target" },
        { id: "weight", title: "weight" },
      ],
    });
  }

  async write() {
    try {
      fs.mkdirSync("build/outputs");
    } catch (e) {
      // ignore
    }

    await Promise.all([
      this.nodesWriter.writeRecords(
        this.graph.nodes.map((node) => ({
          id: node.getName(),
        }))
      ),
      this.edgesWriter.writeRecords(
        this.graph.edges.map((edge) => ({
          source: edge.getSource(),
          target: edge.getDestination(),
          weight: edge.getWeight(),
        }))
      ),
    ]);

    console.log("Finished writing graph data.");
  }
}

module.exports = GraphCsvWriter;
