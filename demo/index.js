// @ts-check

const {
  PlainExtractionClientConfig,
  ExtractionClient,
} = require("../lib/extraction");

const relationshipPresenceReward = 10;
const parentOnlyChildReward = 5;
const leafChildTableReward = 10;
const parentHubPenalty = 10;

const databaseConfigurations = [
  // new PlainExtractionClientConfig(
  //   "pagila",
  //   "localhost",
  //   "pagila",
  //   "editor",
  //   "N0A8KHWWHMjRBTrc8UjL",
  //   "public",
  //   true
  // ),
  // new PlainExtractionClientConfig(
  //   "auction",
  //   "localhost",
  //   "auction",
  //   "editor",
  //   "N0A8KHWWHMjRBTrc8UjL",
  //   "public",
  //   true
  // ),
  // new PlainExtractionClientConfig(
  //   "chinook",
  //   "localhost",
  //   "chinook",
  //   "editor",
  //   "N0A8KHWWHMjRBTrc8UjL",
  //   "public",
  //   true
  // ),
  // new PlainExtractionClientConfig(
  //   "northwind",
  //   "localhost",
  //   "northwind",
  //   "editor",
  //   "N0A8KHWWHMjRBTrc8UjL",
  //   "public",
  //   true
  // ),

  new PlainExtractionClientConfig(
    "adventureworks",
    "localhost",
    "Adventureworks",
    "postgres",
    "postgres",
    // @ts-ignore
    ["humanresources", "person", "production", "purchasing", "sales"],
    true,
    parentHubPenalty,
    parentOnlyChildReward,
    relationshipPresenceReward,
    leafChildTableReward
  ),
];

async function main() {
  databaseConfigurations.forEach(async (extractionClientConfig) => {
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
