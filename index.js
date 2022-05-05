// @ts-check

const ExtractionClient = require("./ExtractionClient");
const { Connection } = require("./lib/db");

const connections = [
  new Connection(
    "localhost",
    "pagila",
    "editor",
    "N0A8KHWWHMjRBTrc8UjL",
    "public"
  ),
  new Connection(
    "localhost",
    "auction",
    "editor",
    "N0A8KHWWHMjRBTrc8UjL",
    "public"
  ),
  new Connection(
    "localhost",
    "chinook",
    "editor",
    "N0A8KHWWHMjRBTrc8UjL",
    "public"
  ),
  new Connection("localhost", "Adventureworks", "postgres", "postgres", [
    "humanresources",
    "person",
    "production",
    "purchasing",
    "sales",
  ]),
];

async function main() {
  connections.forEach(async (connection) => {
    const client = new ExtractionClient(connection.database, connection);

    try {
      const tables = await client.extractDatabaseTables();
      const entityRelationshipModel =
        client.buildEntityRelationshipModel(tables);
      const graph = client.buildGraph(entityRelationshipModel);

      client.writeGraph(graph);
    } catch (error) {
      console.error(`Failed. Reason: ${JSON.stringify(error)}`);
      throw error;
    }
  });
}

main();
