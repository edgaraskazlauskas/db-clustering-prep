//@ts-check

const EntityRelationship = require("./EntityRelationship");
const EntityRelationshipModel = require("./EntityRelationshipModel");
const EntityTableColumn = require("./EntityTableColumn");

module.exports = class EntityTable {
  /**
   * @param {String} name
   * @param {EntityTableColumn[]} columns
   */
  constructor(name, columns) {
    this.name = name;
    this.columns = columns;
  }

  /**
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  /**
   * @returns {EntityTable[]}
   */
  getChildren() {
    return this.entityRelationshipModel
      .getRelationships()
      .filter((relationship) => relationship.parent === this.name)
      .map((relationship) =>
        this.entityRelationshipModel.getEntity(relationship.child)
      );
  }

  /**
   * @param {String} childName
   * @returns {EntityTable[]}
   */
  getChildrenOtherThan(childName) {
    return this.getChildren().filter((child) => child.name !== childName);
  }

  /**
   * @param {String} parentName
   * @returns {EntityTable[]}
   */
  getParentsOtherThan(parentName) {
    return this.getParents().filter((parent) => parent.name !== parentName);
  }

  getColumns() {
    return this.columns;
  }

  getParents() {
    return this.entityRelationshipModel
      .getRelationships()
      .filter((relationship) => relationship.child === this.name)
      .map((relationship) =>
        this.entityRelationshipModel.getEntity(relationship.parent)
      );
  }
};
