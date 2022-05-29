// @ts-check
const Lodash = require("lodash");

class ModularityInformationLine {
  /**
   * @param {String} id
   * @param {String} modularityClass
   */
  constructor(id, modularityClass) {
    this.id = id;
    this.modularityClass = modularityClass;
  }

  getModularityClass() {
    return this.modularityClass;
  }
}

module.exports = class ModularityInformation {
  constructor() {
    this.data = {};
  }

  /**
   * @param {String} id
   * @param {String} modularityClass
   */
  addLine(id, modularityClass) {
    this.data[id] = new ModularityInformationLine(id, modularityClass);
  }

  getLinesByModularityClass() {
    return Lodash.groupBy(Object.values(this.data), (line) =>
      line.getModularityClass()
    );
  }

  getUniqueModulatityClasses() {
    return Object.keys(this.getLinesByModularityClass());
  }

  getAverageClusterSize() {
    const linesByModularityClass = this.getLinesByModularityClass();
    const averageClusterSize = Lodash.mean(
      Object.values(linesByModularityClass).map((array) => array.length)
    );

    return averageClusterSize;
  }

  /**
   *
   * @param {String} tableId
   */
  getTableModularityClass(tableId) {
    return this.data[tableId].getModularityClass();
  }
};
