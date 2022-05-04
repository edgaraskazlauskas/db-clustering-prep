//@ts-check

const EntityRelationshipModel = require("./EntityRelationshipModel");

module.exports = class EntityRelationship {
  /**
   * @private
   * @type {EntityRelationshipModel} entityRelationshipModel
   */
  entityRelationshipModel;

  /**
   * @param {String} child
   * @param {String} parent
   */
  constructor(child, parent) {
    this.child = child;
    this.parent = parent;
  }

  /**
   *
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  get strength() {
    let strength = 10;

    const childrenOfParent = this.entityRelationshipModel
      .getEntity(this.parent)
      .getChildren();

    if (childrenOfParent.length === 1) {
      // This is the only child of the parent
      strength += 15;
      // TODO: Does the parent have any parents of its own? Does it matter?
    }

    const parentsOfChild = this.entityRelationshipModel
      .getEntity(this.child)
      .getParents();

    if (parentsOfChild.length > 1) {
      // This is not the only parent of the child
      parentsOfChild.forEach((parent) => {
        // Penalize for each parent relation
        if (
          parent.getParents().length > 0 ||
          parent.getChildrenOtherThan(this.child).length > 0
        ) {
          strength -= 3;
        }
      });
    }

    if (strength <= 0) {
      // Weight must remain positive
      strength = 1;
    }

    return strength;
  }
};
