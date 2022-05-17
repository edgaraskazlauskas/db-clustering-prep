// @ts-check

const { program } = require("commander");
const {
  PlainExtractionClientConfig,
  ExtractionClient,
} = require("./lib/extraction");

program
  .requiredOption(
    "-h, --dbhost <string>",
    "Database host (localhost by default)",
    "localhost"
  )
  .requiredOption("-n, --dbname <string>", "Database name")
  .requiredOption("-u, --dbuser <string>", "Database user name")
  .requiredOption("-p, --dbpassword <string>", "Database user password")
  .option("-w, --weighted", "Calculate relationship weights")
  .option(
    "-s, --dbschema <string>",
    "Schema name (public by default)",
    "public"
  );

async function main() {
  program.parse();

  const options = program.opts();

  const config = new PlainExtractionClientConfig(
    options.dbname,
    options.dbhost,
    options.dbname,
    options.dbuser,
    options.dbpassword,
    options.dbschema.split(","),
    options.weighted
  );
  const client = new ExtractionClient(config);

  try {
    const tables = await client.extractDatabaseTables();
    const entityRelationshipModel = client.buildEntityRelationshipModel(tables);
    const graph = client.buildGraph(entityRelationshipModel);

    client.writeGraph(graph);
  } catch (error) {
    console.error(`Extraction failed. Reason: "${error}".`);
    throw error;
  }
}

main();
