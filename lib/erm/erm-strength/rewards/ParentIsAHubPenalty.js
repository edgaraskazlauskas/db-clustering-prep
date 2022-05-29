const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");
const EntityRelationshipType = require("../../EntityRelationshipType");

module.exports = class ParentIsAHubPenalty extends (
  EntityRelationshipStrengthVisitor
) {
  static MAX_PENALTY_SIZE = -5;

  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    const { relationshipType, parentChildren } =
      relationshipStrength.getStats();

    const otherChildrenCount = parentChildren.length - 1;

    const penaltySize =
      ParentIsAHubPenalty.MAX_PENALTY_SIZE / parentChildren.length;

    if (
      relationshipType !== EntityRelationshipType.ManyToMany &&
      otherChildrenCount > 0
    ) {
      relationshipStrength.adjust(otherChildrenCount * penaltySize);
    }
  }
};
