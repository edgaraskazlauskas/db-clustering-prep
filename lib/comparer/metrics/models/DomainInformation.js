// @ts-check

const ModularityInformation = require("./ModularityInformation");

class DomainInformationLine {
  /**
   * @param {String} id
   * @param {String} domainName
   */
  constructor(id, domainName) {
    this.id = id;
    this.domainName = domainName;
    this.modularityClass = null;
  }

  getId() {
    return this.id;
  }

  getModularityClass() {
    return this.modularityClass;
  }

  /**
   * @param {String} className
   */
  setModularityClass(className) {
    this.modularityClass = className;
  }
}

module.exports = class DomainInformation {
  constructor() {
    this.data = {};
  }

  /**
   * @param {String} id
   * @param {String} domainName
   */
  addLine(id, domainName) {
    if (!this.data[domainName]) {
      this.data[domainName] = [];
    }

    this.data[domainName].push(new DomainInformationLine(id, domainName));
  }

  getDomains() {
    return Object.keys(this.data);
  }

  getAllNodes() {
    return Object.keys(this.data).reduce(
      (acc, curr) => [...acc, ...this.data[curr]],
      []
    );
  }

  /**
   * @param {String} domainName
   * @returns
   */
  getDomainNodes(domainName) {
    return this.data[domainName];
  }

  /**
   * @private
   * @param {String} domainName
   * @returns
   */
  getDomainModularityClassOccurences(domainName) {
    const modularityClasses = {};

    this.data[domainName].forEach((line) => {
      const modularityClass = line.getModularityClass();

      if (!modularityClasses[modularityClass]) {
        modularityClasses[modularityClass] = 1;
      } else {
        modularityClasses[modularityClass] += 1;
      }
    });

    return modularityClasses;
  }

  /**
   * This method looks at the mapping of which tables should be mapped to which domains.
   * It tries
   *
   * @param {String} domainName
   * @returns
   */
  getDominatingModularityClass(domainName) {
    const classCountMap = this.getDomainModularityClassOccurences(domainName);

    let dominatingModularityClass = null;
    Object.keys(classCountMap).forEach((key) => {
      if (
        classCountMap[key] > classCountMap[dominatingModularityClass] ||
        dominatingModularityClass === null
      ) {
        dominatingModularityClass = key;
      }
    });
    return dominatingModularityClass;
  }

  getMatchingDomainMetric() {
    return Object.keys(this.data).reduce((acc, domainName) => {
      // Find which modularity class is dominating within this domain
      const domainNodes = this.getDomainNodes(domainName);
      const dominatingClass = this.getDominatingModularityClass(domainName);

      const correctClassCount = domainNodes.filter(({ modularityClass }) => {
        return String(modularityClass) === String(dominatingClass);
      }).length;

      console.debug(
        `${domainName} is ${correctClassCount}/${domainNodes.length} correct.`
      );

      return {
        ...acc,
        [domainName]: correctClassCount,
      };
    }, {});
  }

  /**
   *
   * @param {ModularityInformation} modularityInformation
   */
  enhance(modularityInformation) {
    const domains = Object.keys(this.data);

    domains.forEach((domain) => {
      this.data[domain].forEach((domainInformationLine) => {
        domainInformationLine.setModularityClass(
          modularityInformation.getTableModularityClass(
            domainInformationLine.getId()
          )
        );
      });
    });
  }
};
