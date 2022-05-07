// @ts-check
require("dotenv").config();

module.exports = class Config {
  constructor() {}

  /**
   * @param {String} key
   * @returns {any}
   */
  get(key) {
    const variable = process.env[key];
    if (variable.includes(",")) {
      return variable.split(",");
    }

    return variable;
  }
};
