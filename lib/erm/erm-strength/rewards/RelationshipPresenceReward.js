const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");

module.exports = class RelationshipPresenceReward extends (
  EntityRelationshipStrengthVisitor
) {
  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    relationshipStrength.adjust(this.config.relationshipPresenceReward);
  }
};
