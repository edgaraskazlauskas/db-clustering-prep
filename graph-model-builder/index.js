//@ts-check
const CsvGraphModelBuilder = require("./domain/GraphModelBuilder");

function main() {
  const mappedSchemas = ["adventureworks", "auction-api", "chinook", "pagila"];

  for (const mappedSchemaName of mappedSchemas) {
    const mappedSchema = require(`../db-schema-mapper/build/outputs/${mappedSchemaName}.json`);

    const builder = new CsvGraphModelBuilder(mappedSchema);

    builder.build();
  }
}

main();
