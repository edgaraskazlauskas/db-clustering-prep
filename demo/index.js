// @ts-check

const {
  DominatingClusterMetric,
  ClusterSeparationMetric,
  AverageClusterSizeMetric,
  ExcessiveClusterMetric,
} = require("../lib/comparer/metrics");
const {
  PlainExtractionClientConfig,
  ExtractionClient,
} = require("../lib/extraction");

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
  new PlainExtractionClientConfig(
    "northwind",
    "localhost",
    "northwind",
    "editor",
    "N0A8KHWWHMjRBTrc8UjL",
    "public",
    true
  ),
  // new PlainExtractionClientConfig(
  //   "adventureworks",
  //   "localhost",
  //   "Adventureworks",
  //   "postgres",
  //   "postgres",
  //   // @ts-ignore
  //   ["humanresources", "person", "production", "purchasing", "sales"],
  //   true
  // ),
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

      await new DominatingClusterMetric(
        extractionClientConfig.dbname
      ).evaluate();
      await new ClusterSeparationMetric(
        extractionClientConfig.dbname
      ).evaluate();
      await new ExcessiveClusterMetric(
        extractionClientConfig.dbname
      ).evaluate();
      await new AverageClusterSizeMetric(
        extractionClientConfig.dbname
      ).evaluate();
    } catch (error) {
      console.error(`Failed. Reason: ${error}`);
      throw error;
    }
  });
}

main();
