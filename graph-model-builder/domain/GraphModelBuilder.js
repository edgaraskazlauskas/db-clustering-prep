//@ts-check
const Graph = require("./Graph");
const GraphCsvWriter = require("./GraphCsvWriter");

module.exports = class CsvGraphModelBuilder {
  constructor(mappedSchema) {
    this.mappedSchema = mappedSchema;
  }

  build() {
    const { name, entities, relations } = this.mappedSchema;

    const graph = new Graph(entities, relations);

    graph.print();

    const graphWriter = new GraphCsvWriter(name, graph);

    graphWriter.write();
  }
};
