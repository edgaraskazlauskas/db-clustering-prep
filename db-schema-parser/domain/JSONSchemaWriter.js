//@ts-check
const fs = require("fs");
const { TableOrView } = require("extract-pg-schema");

const SchemaWriter = require("./SchemaWriter");

module.exports = class JSONSchemaWriter extends SchemaWriter {
  /**
   * @param {TableOrView[]} allTables
   */
  async write(allTables) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `build/outputs/${this.getFileName()}`,
        JSON.stringify(allTables, null, 2),
        (err) => {
          if (err) {
            reject("Failed to write schema");
            return;
          }

          resolve();
        }
      );
    });
  }

  /**
   * @returns {String}
   */
  getFileName() {
    return `${this.name}.json`;
  }
};
