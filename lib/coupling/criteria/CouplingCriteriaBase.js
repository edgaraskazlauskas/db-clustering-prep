// @ts-check

const EntityRelationshipModel = require("../../erm/EntityRelationshipModel");

module.exports = class CouplingCriteriaBase {
  /**
   * @protected
   * @type {EntityRelationshipModel}
   */
  entityRelationshipModel;

  /**
   *
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  /**
   * @returns {Number}
   */
  evaluate() {
    throw new Error("Evaluate not implemented!");
  }
};
