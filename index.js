// @ts-check

const ExtractionClient = require("./ExtractionClient");
const ExtractionClientConfig = require("./ExtractionClientConfig");

async function main() {
  const extractionClientConfig = new ExtractionClientConfig();
  const client = new ExtractionClient(extractionClientConfig);

  try {
    const tables = await client.extractDatabaseTables();
    const entityRelationshipModel = client.buildEntityRelationshipModel(tables);
    const graph = client.buildGraph(entityRelationshipModel);

    client.writeGraph(graph);
  } catch (error) {
    console.error(`Failed. Reason: ${error}`);
    throw error;
  }
}

main();
