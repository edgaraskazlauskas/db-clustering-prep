//@ts-check
const { TableOrView } = require("extract-pg-schema");

module.exports = class SchemaWriter {
  /**
   * @property {String}
   * @protected
   */
  name;

  /**
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   *
   * @param {TableOrView[]} allTables
   * @returns {Promise<void>}
   */
  async write(allTables) {
    throw new Error("Write not implemented");
  }

  /**
   * @returns {String}
   */
  getFileName() {
    throw new Error("File name getter not implemented");
  }
};
