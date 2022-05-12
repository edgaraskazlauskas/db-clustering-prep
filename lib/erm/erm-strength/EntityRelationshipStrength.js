/**
 * @typedef {Object} Stats
 * @property {String} relationshipType
 * @property {EntityTable[]} parentChildren
 * @property {EntityTable[]} childParents
 * @property {EntityTable[]} childChildren
 */

module.exports = class EntityRelationshipStrength {
  /**
   * @param {Stats} stats
   */
  constructor(stats) {
    /**
     * @private
     */
    this.stats = stats;
    /**
     * @private
     */
    this.strength = 1;
  }

  /**
   *
   * @param {Visitor} visitor
   */
  apply(visitor) {
    visitor.visit(this);
  }

  /**
   *
   * @returns {Number}
   */
  getValue() {
    return this.strength;
  }

  /**
   * @param {Number} value
   */
  adjust(value) {
    this.strength += value;
  }

  /**
   * @returns {Stats}
   */
  getStats() {
    return this.stats;
  }
};
