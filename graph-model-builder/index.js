//@ts-check
const Graph = require("./domain/Graph");
const GraphCsvWriter = require("./domain/GraphCsvWriter");

function main() {
  const mappedSchemas = ["adventureworks", "auction-api", "chinook", "pagila"];

  for (const mappedSchemaName of mappedSchemas) {
    const {
      entities,
      relations,
    } = require(`../db-schema-mapper/build/outputs/${mappedSchemaName}.json`);

    const graph = new Graph(entities, relations);

    graph.print();

    const graphWriter = new GraphCsvWriter(mappedSchemaName, graph);

    graphWriter.write();
  }
}

main();
