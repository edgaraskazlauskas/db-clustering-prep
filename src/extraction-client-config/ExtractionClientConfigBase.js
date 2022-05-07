//@ts-check

const { Connection } = require("../../lib/db");

module.exports = class ExtractionClientConfigBase {
  /**
   * @returns {String}
   */
  getName() {
    throw new Error("Name getter not implemeneted");
  }

  /**
   * @returns {Connection}
   */
  getConnection() {
    throw new Error("Connection builder not implemented");
  }

  /**
   * @returns {String[]}
   */
  getUniqueKeyIndicators() {
    throw new Error("Unique key indicator getter not implemented");
  }

  /**
   * @returns {String[]}
   */
  getTimestampIndicators() {
    throw new Error("Timestamp column indicator getter not implemented");
  }
};
