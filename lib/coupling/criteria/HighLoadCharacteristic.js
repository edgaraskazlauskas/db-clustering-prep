// @ts-check

const EntityRelationship = require("../../erm/EntityRelationship");
const CouplingCriteriaBase = require("./CouplingCriteriaBase");

module.exports = class HighLoadCharacteristic extends CouplingCriteriaBase {
  /**
   * @param {String[]} entities
   */
  constructor(entities) {
    super();

    this.entities = entities;
  }

  /**
   *
   * @param {EntityRelationship} relationship
   * @returns
   */
  isApplicableTo(relationship) {
    const [entity] = this.entities;

    /**
     * If the child is related to the high load entity.
     */
    if (relationship.parent === entity) {
      return true;
    }

    return false;
  }
};
