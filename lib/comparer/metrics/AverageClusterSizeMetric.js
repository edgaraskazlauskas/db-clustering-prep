// @ts-check

const Metric = require("./Metric");
const Lodash = require("lodash");

/**
 * This metric evaluates whether all expected domains were split out
 */
module.exports = class AverageClusterSizeMetric extends Metric {
  async evaluate() {
    const modularityInformation = await this.readModularityInformation();
    const averageClusterSize = modularityInformation.getAverageClusterSize();

    console.debug(`Average cluster size is ${averageClusterSize}`);
  }
};
