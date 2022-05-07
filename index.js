// @ts-check

const ExtractionClient = require("./src/extraction-client/ExtractionClient");
const EnvExtractionClientConfig = require("./src/extraction-client-config/EnvExtractionClientConfig");

async function main() {
  const extractionClientConfig = new EnvExtractionClientConfig();
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
