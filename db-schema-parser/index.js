//@ts-check
const SchemaParser = require("./domain/SchemaParser");
const JSONSchemaWriter = require("./domain/JSONSchemaWriter");
const SchemaExtractor = require("./domain/SchemaExtractor");

function main() {
  const connections = [
    new SchemaParser.Connection(
      "localhost",
      "pagila",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new SchemaParser.Connection(
      "localhost",
      "auction",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new SchemaParser.Connection(
      "localhost",
      "chinook",
      "editor",
      "N0A8KHWWHMjRBTrc8UjL",
      "public"
    ),
    new SchemaParser.Connection(
      "localhost",
      "Adventureworks",
      "postgres",
      "postgres",
      ["humanresources", "person", "production", "purchasing", "sales"]
    ),
  ];

  connections.forEach((connection) => {
    const parser = new SchemaParser(connection);
    const writer = new JSONSchemaWriter(connection.database);
    const extractor = new SchemaExtractor(parser, writer);

    extractor
      .extract()
      .then(() => {
        console.warn("Finished writing schema");
      })
      .catch((error) => {
        console.warn("Failed to write schema", error);
      });
  });
}

main();
