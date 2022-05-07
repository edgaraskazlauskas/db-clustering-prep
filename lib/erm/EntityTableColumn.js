// @ts-check

module.exports = class EntityTableColumn {
  /**
   * @param {String} name
   * @param {Object} reference
   * @param {Object[]} indices
   * @param {Boolean} isTimestampColumn
   */
  constructor(name, reference, indices, isTimestampColumn) {
    this.name = name;
    this.reference = reference;
    this.indices = indices;
    this.isTimestampColumn = isTimestampColumn;
  }

  hasReference() {
    return !!this.reference;
  }

  isTimestamp() {
    return this.isTimestampColumn;
  }
};
