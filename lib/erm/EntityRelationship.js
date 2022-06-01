// @ts-check

const {
  EntityRelationshipStrength,
  RelationshipPresenceReward,
  ParentIsAHubPenalty,
  LeafChildTableReward,
  ParentOnlyChildReward,
} = require("./erm-strength");
const EntityRelationshipModel = require("./EntityRelationshipModel");
const EntityTable = require("./EntityTable");
const EntityRelationshipType = require("./EntityRelationshipType");
const RewardsConfig = require("./erm-strength/rewards/RewardsConfig");

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
    /**
     * TODO Maybe pass in the type here also? then the construction of the type becomes the consumers responsibility
     */
    this.child = child;
    this.parent = parent;
    this.isUnique = isUnique;
    this.isPrimary = isPrimary;
  }

  /**
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  setEntityRelationshipModel(entityRelationshipModel) {
    this.entityRelationshipModel = entityRelationshipModel;
  }

  /**
   * @private
   */
  calculateType() {
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
   *
   * @param {RewardsConfig} config
   */
  calculateStrength(config) {
    const child = this.entityRelationshipModel.getEntity(this.child);
    const parent = this.entityRelationshipModel.getEntity(this.parent);

    /**
     * @type {Stats}
     */
    const stats = {
      relationshipType: this.calculateType(),
      parentChildren: parent.getChildren(),
      childParents: child.getParents(),
      childChildren: child.getChildren(),
    };
    const strength = new EntityRelationshipStrength(stats);
    strength.apply(new ParentOnlyChildReward(config));
    strength.apply(new RelationshipPresenceReward(config));
    strength.apply(new LeafChildTableReward(config));
    strength.apply(new ParentIsAHubPenalty(config));

    return strength.getValue() <= 0 ? 1 : strength.getValue();
  }
};
