const { extractSchema } = require("extract-pg-schema");
const fs = require("fs");

async function parseAdventreworksSchema() {
  const connection = {
    host: "localhost",
    database: "Adventureworks",
    user: "postgres",
    password: "postgres",
  };

  const allTables = [];

  await Promise.all(
    ["humanresources", "person", "production", "purchasing", "sales"].map(
      async (schema) => {
        const result = await extractSchema(schema, connection);
        allTables.push(...result.tables);
      }
    )
  );

  fs.writeFileSync("Adventureworks.json", JSON.stringify(allTables, null, 2));
}

module.exports = parseAdventreworksSchema;
