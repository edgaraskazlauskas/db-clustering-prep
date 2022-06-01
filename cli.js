// @ts-check

const ReadLine = require("readline");
const Commander = require("commander");
const {
  PlainExtractionClientConfig,
  ExtractionClient,
} = require("./lib/extraction");

console.clear();

Commander.program
  .requiredOption(
    "-h, --dbhost <string>",
    "Database host (localhost by default)",
    "localhost"
  )
  .requiredOption("-n, --dbname <string>", "Database name")
  .requiredOption("-u, --dbuser <string>", "Database user name")
  .requiredOption("-p, --dbpassword <string>", "Database user password")
  .option("-w, --weighted", "Calculate relationship weights")
  .option("-m, --metrics", "Calculate metrics")
  .option("--watch", "Watch file system changes")
  .option(
    "-s, --dbschema <string>",
    "Schema name (public by default)",
    "public"
  )
  .option("--parentHubPenalty <number>")
  .option("--parentOnlyChildReward <number>")
  .option("--relationshipPresenceReward <number>")
  .option("--leafChildTableReward <number>");

Commander.program.parse();

const options = Commander.program.opts();

async function main() {
  const config = new PlainExtractionClientConfig(
    options.dbname,
    options.dbhost,
    options.dbname,
    options.dbuser,
    options.dbpassword,
    options.dbschema.split(","),
    options.weighted,
    options.parentHubPenalty,
    options.parentOnlyChildReward,
    options.relationshipPresenceReward,
    options.leafChildTableReward
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

ReadLine.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "r") {
    main();
  } else if (key.name === "q") {
    process.exit();
  }
});
