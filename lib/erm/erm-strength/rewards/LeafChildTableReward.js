const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");

module.exports = class LeafChildTableReward extends (
  EntityRelationshipStrengthVisitor
) {
  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    const { childChildren, childParents } = relationshipStrength.getStats();

    const isOnlyOneParentPresent = childParents.length === 1;
    const hasNoChildren = childChildren.length <= 0;
    if (
      isOnlyOneParentPresent && // Take into account relations such as `password_reset (only has one parent, no children) -> user_credentials`
      hasNoChildren // Take into account relations such as `bidder (only has one parent, but has children) -> user_profile`
    ) {
      relationshipStrength.adjust(this.config.leafChildTableReward);
    }
  }
};
