//@ts-check

const EntityRelationship = require("./EntityRelationship");
const EntityRelationshipModel = require("./EntityRelationshipModel");

module.exports = class EntityTable {
  /**
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  /**
   * @param {(relationship: EntityRelationship) => boolean} [additionalRelationshipFilter]
   * @returns
   */
  getChildren(additionalRelationshipFilter) {
    return this.entityRelationshipModel
      .getRelationships()
      .filter((relationship) => {
        return relationship.parent === this.name && additionalRelationshipFilter
          ? additionalRelationshipFilter(relationship)
          : true;
      })
      .map((relationship) =>
        this.entityRelationshipModel.getEntity(relationship.child)
      );
  }

  /**
   * @param {String} childName
   * @returns {EntityTable[]}
   */
  getChildrenOtherThan(childName) {
    return this.getChildren((relationship) => relationship.child !== childName);
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
