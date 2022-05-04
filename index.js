// @ts-check

const ExtractionClient = require("./ExtractionClient");

const connection = new ExtractionClient.Connection(
  "localhost",
  "auction",
  "editor",
  "N0A8KHWWHMjRBTrc8UjL",
  "public"
);

async function main() {
  const client = new ExtractionClient("auction", connection);

  try {
    const tables = await client.extractDatabaseTables();
    const entityRelationshipModel = client.buildEntityRelationshipModel(tables);
    const graph = client.buildGraph(entityRelationshipModel);

    client.writeGraph(graph);
  } catch (error) {
    console.error(`Failed. Reason: ${JSON.stringify(error)}`);
    throw error;
  }
}

main();
