// @ts-check

const Metric = require("./Metric");

/**
 * This metric evaluates whether tables from the same domain are colocated.
 */
module.exports = class DominatingClusterMetric extends Metric {
  async evaluate() {
    const domainInformation = await this.readDomainInformation();
    const modularityInformation = await this.readModularityInformation();

    domainInformation.enhance(modularityInformation);

    const accuracyMap = domainInformation.getMatchingDomainMetric();

    const allNodesCount = Object.keys(domainInformation.getAllNodes()).length;
    const matchingDominatingClusterCount = Object.values(accuracyMap).reduce(
      sumAccumulating,
      0
    );

    console.debug(
      `Overall accuracy is ${matchingDominatingClusterCount} / ${allNodesCount} = ${
        matchingDominatingClusterCount / allNodesCount
      }`
    );
  }
};

const sumAccumulating = (acc, curr) => acc + curr;
