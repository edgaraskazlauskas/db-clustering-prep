const parseSchema = require("./app");

function main() {
  const schemaNames = [
    "chinook",
    "adventureworks",
    "auction-api",
    "dvd-rental",
    "pagila",
    "pet-clinic",
  ];

  schemaNames.forEach((schemaName) => {
    const schema = require(`./../db-schema-parser/build/outputs/${schemaName}.json`);
    parseSchema(schemaName, schema);
  });
}

main();
