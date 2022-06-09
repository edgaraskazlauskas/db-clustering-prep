// @ts-check

const Commander = require("commander");
const {
  DominatingClusterMetric,
  ClusterSeparationMetric,
  AverageClusterSizeMetric,
  ExcessiveClusterMetric,
} = require("./../lib/comparer/metrics");

console.clear();

Commander.program
  .requiredOption("-n, --dbname <string>", "Database name")
  .requiredOption(
    "-r, --resolution <number>",
    "Resolution param used for accessing inputs CSV"
  );

Commander.program.parse();

const options = Commander.program.opts();

async function main() {
  async function evaluateCoreMetrics() {
    await new DominatingClusterMetric(
      options.dbname,
      options.resolution
    ).evaluate();
    await new ClusterSeparationMetric(
      options.dbname,
      options.resolution
    ).evaluate();
    await new ExcessiveClusterMetric(
      options.dbname,
      options.resolution
    ).evaluate();
    await new AverageClusterSizeMetric(
      options.dbname,
      options.resolution
    ).evaluate();
  }

  await evaluateCoreMetrics();
}

main();
