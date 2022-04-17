const { extractSchema } = require("extract-pg-schema");
const fs = require("fs");

async function parseAuctionApiSchema() {
  const connection = {
    host: "localhost",
    database: "auction",
    user: "editor",
    password: "N0A8KHWWHMjRBTrc8UjL",
  };

  const allTables = [];

  console.log("do");
  await Promise.all(
    ["public"].map(async (schema) => {
      const result = await extractSchema(schema, connection);
      allTables.push(...result.tables);
    })
  );

  console.log("done");
  fs.writeFileSync("AuctionApi.json", JSON.stringify(allTables, null, 2));
}

module.exports = parseAuctionApiSchema;
