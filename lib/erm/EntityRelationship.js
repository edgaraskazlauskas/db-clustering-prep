//@ts-check

const EntityRelationshipModel = require("./EntityRelationshipModel");
const EntityTable = require("./EntityTable");

const EntityRelationshipType = {
  OneToOne: "OneToOne",
  ManyToMany: "ManyToMany",
  Other: "Other",
};

/**
 * @typedef {Object} Stats
 * @property {String} relationshipType
 * @property {EntityTable[]} parentChildren
 * @property {EntityTable[]} childParents
 * @property {EntityTable[]} childChildren
 */

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
    const child = this.entityRelationshipModel.getEntity(this.child);
    const parent = this.entityRelationshipModel.getEntity(this.parent);

    /**
     * @type {Stats}
     */
    const stats = {
      parentChildren: parent.getChildren(),
      childParents: child.getParents(),
      childChildren: child.getChildren(),
      relationshipType: this.type,
    };

    const strengthList = [
      this.getRelationshipPresenceBonus,
      this.getParentOnlyChildBonus,
      this.getTightlyCoupledTableBonus,
      this.getParentIsAHubPenalty,
    ].map((fn) => fn.bind(this)(stats));

    const strength = strengthList.reduce((acc, curr) => acc + curr, 0);

    return strength <= 0 ? 1 : strength;
  }

  getRelationshipPresenceBonus() {
    return 10;
  }

  /**
   * @param {Stats} stats
   * @returns {Number}
   */
  getParentOnlyChildBonus(stats) {
    if (
      // Check if parent doesn't have other children, if so, then strengthen this relation as the parent is unlikely to be a hub
      stats.parentChildren.length - 1 === 0 &&
      // Don't strengthen ManyToManyRelations? Why? // TODO this if condition might need to be moved inside
      stats.relationshipType !== EntityRelationshipType.ManyToMany
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
      return 5;
    }

    return 0;
  }

  /**
   * @param {Stats} stats
   * @returns {Number}
   */
  getTightlyCoupledTableBonus(stats) {
    if (
      stats.childParents.length - 1 === 0 && // Take into account relations such as `password_reset (only has one parent, no children) -> user_credentials`
      !(stats.childChildren.length > 0) // Take into account relations such as `bidder (only has one parent, but has children) -> user_profile`
    ) {
      return 5;
    }

    return 0;
  }

  /**
   * @param {Stats} stats
   * @returns {Number}
   */
  getParentIsAHubPenalty(stats) {
    if (stats.relationshipType !== EntityRelationshipType.ManyToMany) {
      return (stats.parentChildren.length - 1) * -3;
    }

    return 0;
  }
};
