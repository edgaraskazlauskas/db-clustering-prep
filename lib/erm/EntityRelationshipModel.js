//@ts-check

const CouplingCriteriaBase = require("../coupling/criteria/CouplingCriteriaBase");
const EntityRelationship = require("./EntityRelationship");
const EntityTable = require("./EntityTable");

module.exports = class EntityRelationshipModel {
  constructor() {
    this.entities = {};
    this.relationships = {};
  }

  /**
   * @param {EntityTable} table
   */
  registerTable(table) {
    this.entities[table.name] = table;
    table.setEntityRelationshipModel(this);
  }

  /**
   * @param {EntityRelationship} relationship
   */
  registerRelationship(relationship) {
    this.relationships[`${relationship.child}_${relationship.parent}`] =
      relationship;
    relationship.setEntityRelationshipModel(this);
  }

  /**
   *
   * @param {CouplingCriteriaBase} couplingCriteria
   */
  registerCouplingCriteria(couplingCriteria) {
    couplingCriteria.setEntityRelationshipModel(this);
  }

  /**
   * @param {String} name
   * @returns {EntityTable}
   */
  getEntity(name) {
    return this.entities[name];
  }

  /**
   * @returns {EntityTable[]}
   */
  getEntities() {
    return Object.values(this.entities);
  }

  /**
   * @returns {EntityRelationship[]}
   */
  getRelationships() {
    return Object.values(this.relationships);
  }
};
