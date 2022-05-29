// @ts-check

const Metric = require("./Metric");
const Lodash = require("lodash");

/**
 * This metric evaluates whether all expected domains were split out
 */
module.exports = class ClusterSeparationMetric extends Metric {
  async evaluate() {
    const domainInformation = await this.readDomainInformation();
    const modularityInformation = await this.readModularityInformation();

    domainInformation.enhance(modularityInformation);

    // Check if all domains are present
    const domains = domainInformation.getDomains();
    const modularityClassByDomain = {};
    domains.forEach((domainName) => {
      const domainModularityClass =
        domainInformation.getDominatingModularityClass(domainName);
      modularityClassByDomain[domainName] = domainModularityClass;
    });

    const uniqueClusters = Lodash.uniq(
      Object.values(modularityClassByDomain)
    ).length;
    const allClusters = Object.values(modularityClassByDomain).length;
    console.debug(
      `Cluster accuracy is ${uniqueClusters} / ${allClusters} = ${
        uniqueClusters / allClusters
      }`
    );
    console.debug(modularityClassByDomain);
  }
};
