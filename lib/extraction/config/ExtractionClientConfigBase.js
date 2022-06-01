//@ts-check

const { Connection } = require("../../db");
const { RewardsConfig } = require("../../erm/erm-strength");

module.exports = class ExtractionClientConfigBase {
  /**
   * @returns {String}
   */
  getName() {
    throw new Error("Name getter not implemeneted");
  }

  /**
   * @returns {RewardsConfig}
   */
  getRewardsConfig() {
    throw new Error("Rewards config getter not implemented");
  }

  /**
   * @returns {Boolean}
   */
  getIsWeighted() {
    throw new Error("Weighted getter not implemented");
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
