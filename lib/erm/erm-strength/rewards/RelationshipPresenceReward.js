const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");

module.exports = class RelationshipPresenceReward extends (
  EntityRelationshipStrengthVisitor
) {
  static SIZE = 10;

  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    relationshipStrength.adjust(RelationshipPresenceReward.SIZE);
  }
};
