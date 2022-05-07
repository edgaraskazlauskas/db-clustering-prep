//@ts-check

const EntityRelationshipModel = require("./EntityRelationshipModel");

const EntityRelationshipType = {
  OneToOne: "OneToOne",
  ManyToMany: "ManyToMany",
  Other: "Other",
};

module.exports = class EntityRelationship {
  /**
   * @private
   * @type {EntityRelationshipModel} entityRelationshipModel
   */
  entityRelationshipModel;

  /**
   * @param {String} child
   * @param {String} parent
   * @param {Boolean} isUnique
   * @param {Boolean} isPrimary
   */
  constructor(child, parent, isUnique, isPrimary) {
    this.child = child;
    this.parent = parent;
    this.isUnique = isUnique;
    this.isPrimary = isPrimary;
  }

  /**
   *
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  get type() {
    const child = this.entityRelationshipModel.getEntity(this.child);

    const isManyToManyRelationship =
      child.getParents().length === 2 &&
      child
        .getColumns()
        .filter((column) => !column.isTimestamp())
        .every((column) => column.hasReference());

    if (isManyToManyRelationship) {
      return EntityRelationshipType.ManyToMany;
    }

    const isOneToOneRelationship = this.isUnique || this.isPrimary;
    if (isOneToOneRelationship) {
      return EntityRelationshipType.OneToOne;
    }

    return EntityRelationshipType.Other;
  }

  /**
   * Strength of the relation.
   * Note: It is only calculated from the CHILD's perspective as it's directed child -> parent.
   * This means the relation from parent side will not exist and the parent will not be able to penalize or boost the relation in any way.
   */
  get strength() {
    let strength = 10;

    const child = this.entityRelationshipModel.getEntity(this.child);
    const parent = this.entityRelationshipModel.getEntity(this.parent);
    if (
      // Check if parent doesn't have other children, if so, then strengthen this relation as the parent is unlikely to be a hub
      parent.getChildrenOtherThan(this.child).length === 0 &&
      // Don't strengthen ManyToManyRelations? Why? // TODO this if condition might need to be moved inside
      this.type !== EntityRelationshipType.ManyToMany
    ) {
      /**
       * Parent is not related to any other children, means it has no incoming relations.
       * It's most likely a data extension table used to minimize source table size.
       * We could be more certain about it if we also checked if the parent has no parents itself
       * - but IT IS NOT NECESSARY as it may have parents like 'country', 'city', etc.
       * - - these region tables could be joined, but if they have other incoming relations (have children), then they should be split out.
       *
       * user -> profile (PENALIZE) -> country <- (PENALIZE) company
       */
      strength += 5;
      console.debug(
        `${this.child} -> ${this.parent}: only child of parent bonus granted`
      );
    } else if (
      child.getParentsOtherThan(this.parent).length === 0 && // Take into account relations such as `password_reset (only has one parent, no children) -> user_credentials`
      child.getChildren().length === 0 // Take into account relations such as `bidder (only has one parent, but has children) -> user_profile`
    ) {
      strength += 5;
      console.debug(
        `${this.child} -> ${this.parent}: only parent of child bonus granted`
      );
    } else {
      /**
       * Parent entity has more children, it's likely a hub itself
       */
      if (this.type !== EntityRelationshipType.ManyToMany) {
        parent.getChildrenOtherThan(this.child).forEach(() => {
          strength -= 3;
        });
      }

      if (this.type === EntityRelationshipType.ManyToMany) {
        console.debug(
          `detected M:M relation between ${this.child} and ${this.parent}`
        );
      }

      if (this.type === EntityRelationshipType.OneToOne) {
        console.debug(
          `detected 1:1 relation between ${this.child} and ${this.parent}`
        );

        // Penalize for each child so that none of them are added to the hub
        if (child.getChildren().length > 0) {
          // The more children it has, the more likely it is a hub.
          parent.getChildrenOtherThan(this.child).forEach(() => {
            strength -= 3;
          });
        }
      }
    }

    return strength <= 0 ? 1 : strength;
  }
};
