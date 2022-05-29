// @ts-check

const CsvInformation = require("./models/CsvInformation");
const DomainInformation = require("./models/DomainInformation");
const ModularityInformation = require("./models/ModularityInformation");

// const MODULARITY = 0.5;
// const MODULARITY = 1;
// const MODULARITY = 2;
const MODULARITY = 3;

module.exports = class Metric {
  /**
   * @param {String} databaseName
   */
  constructor(databaseName) {
    this.databaseName = databaseName;
  }

  async evaluate() {
    throw new Error("Evaluate not implemented");
  }

  /**
   * @protected
   */
  async readDomainInformation() {
    const domainCsv = new CsvInformation(
      `/lib/comparer/build/domains/${this.databaseName}.csv`
    );
    const domainRows = await domainCsv.parse();

    const domainInformation = new DomainInformation();

    domainRows.forEach((row) => {
      domainInformation.addLine(row.id, row.domain);
    });

    return domainInformation;
  }

  /**
   * @protected
   */
  async readModularityInformation() {
    const modularityCsv = new CsvInformation(
      `/lib/comparer/build/inputs/modularity-${MODULARITY}/${this.databaseName}.csv`
    );
    const modularityRows = await modularityCsv.parse();

    const modularityInformation = new ModularityInformation();

    modularityRows.forEach((row) => {
      modularityInformation.addLine(row["Id"], row["modularity_class"]);
    });

    return modularityInformation;
  }
};
