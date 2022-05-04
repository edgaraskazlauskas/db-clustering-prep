// @ts-check

module.exports = class SchemaLoader {
  /**
   * @param {String} schemaName
   * @returns {Object}
   */
  load(schemaName) {
    return require(`../db-schema-mapper/build/outputs/${schemaName}.json`);
  }
};
