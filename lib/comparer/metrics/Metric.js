// @ts-check

const CsvInformation = require("./models/CsvInformation");
const DomainInformation = require("./models/DomainInformation");
const ModularityInformation = require("./models/ModularityInformation");

module.exports = class Metric {
  /**
   * @param {String} databaseName
   * @param {String} resolution
   */
  constructor(databaseName, resolution) {
    this.resolution = resolution;
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
    const modularityCsv = 1
      ? new CsvInformation(
          `/lib/comparer/build/inputs/sensitivity-test/${this.databaseName}-${this.resolution}.csv`
        )
      : new CsvInformation(
          `/lib/comparer/build/inputs/resolution-${this.resolution}/${this.databaseName}.csv`
        );
    const modularityRows = await modularityCsv.parse();

    const modularityInformation = new ModularityInformation();

    modularityRows.forEach((row) => {
      modularityInformation.addLine(row["Id"], row["modularity_class"]);
    });

    return modularityInformation;
  }
};
