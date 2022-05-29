// @ts-check

const Metric = require("./Metric");

/**
 * This metric evaluates whether all expected domains were split out
 */
module.exports = class ExcessiveClustersMetric extends Metric {
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

    const modularityClasses =
      modularityInformation.getUniqueModulatityClasses();
    const deviation =
      Math.max(domains.length, modularityClasses.length) -
      Math.min(domains.length, modularityClasses.length);

    console.debug(
      `Expected cluster count was ${domains.length}, got ${modularityClasses.length}. Deviation is ${deviation}.`
    );
  }
};
