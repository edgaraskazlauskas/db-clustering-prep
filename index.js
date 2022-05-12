// @ts-check

const ExtractionClient = require("./src/extraction-client/ExtractionClient");
const PlainExtractionClientConfig = require("./src/extraction-client-config/PlainExtractionClientConfig");

async function main() {
  const configs = [
    new PlainExtractionClientConfig(
      "pagila",
      "localhost",
      "pagila",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new PlainExtractionClientConfig(
      "auction",
      "localhost",
      "auction",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new PlainExtractionClientConfig(
      "chinook",
      "localhost",
      "chinook",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new PlainExtractionClientConfig(
      "northwind",
      "localhost",
      "northwind",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    // new PlainExtractionClientConfig(
    //   "adventureworks",
    //   "localhost",
    //   "Adventureworks",
    //   "postgres",
    //   "postgres",
    //   ["humanresources", "person", "production", "purchasing", "sales"]
    // ),
  ];

  configs.forEach(async (extractionClientConfig) => {
    const client = new ExtractionClient(extractionClientConfig);

    try {
      const tables = await client.extractDatabaseTables();
      const entityRelationshipModel =
        client.buildEntityRelationshipModel(tables);
      const graph = client.buildGraph(entityRelationshipModel);

      client.writeGraph(graph);
    } catch (error) {
      console.error(`Failed. Reason: ${error}`);
      throw error;
    }
  });
}

main();
