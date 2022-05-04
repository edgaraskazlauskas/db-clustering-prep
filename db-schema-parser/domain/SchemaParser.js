//@ts-check
const { extractSchema } = require("extract-pg-schema");

class Connection {
  /**
   * @property {String}
   * @public
   */
  host;

  /**
   * @property {String}
   * @public
   */
  database;

  /**
   * @property {String}
   * @public
   */
  user;

  /**
   * @property {String}
   * @public
   */
  password;

  /**
   * @property {String | String[]}
   * @public
   */
  schema;

  /**
   * @param {String} host
   * @param {String} database
   * @param {String} user
   * @param {String} password
   * @param {String | String[]} schema
   */
  constructor(host, database, user, password, schema) {
    this.host = host;
    this.database = database;
    this.user = user;
    this.password = password;
    this.schema = schema;
  }
}

module.exports.Connection = Connection;

module.exports = class SchemaParser {
  /**
   * @param {Connection} connection
   * @returns
   */
  constructor(connection) {
    this.connection = connection;
  }

  async parse() {
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
