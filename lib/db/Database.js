//@ts-check

const { extractSchema } = require("extract-pg-schema");
const Connection = require("./Connection");

module.exports = class Database {
  /**
   * @param {Connection} connection
   */
  constructor(connection) {
    this.connection = connection;
  }

  async extractTables() {
    /**
     * @type {import('extract-pg-schema').TableOrView[]}
     */
    const allTables = [];
    const schemas = Array.isArray(this.connection.schema)
      ? this.connection.schema
      : [this.connection.schema];

    await Promise.all(
      schemas.map(async (schema) => {
        const result = await extractSchema(schema, this.connection, false);
        allTables.push(...result.tables);
      })
    );

    return allTables;
  }
};
