//@ts-check
const Graph = require("./domain/Graph");
const GraphCsvWriter = require("./domain/GraphCsvWriter");

const mappedSchemas = ["adventureworks", "auction-api"];

function main() {
  for (const mappedSchemaName of mappedSchemas) {
    const {
      entities,
      relations,
    } = require(`../db-schema-mapper/sample-results/${mappedSchemaName}.json`);

    const graph = new Graph(entities, relations);

    graph.print();

    const graphWriter = new GraphCsvWriter(mappedSchemaName, graph);
    graphWriter.write();
  }
}

main();
