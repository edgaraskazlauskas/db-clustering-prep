const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");
const EntityRelationshipType = require("../../EntityRelationshipType");

module.exports = class ParentIsAHubPenalty extends (
  EntityRelationshipStrengthVisitor
) {
  static SIZE = -3;

  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    const { relationshipType, parentChildren } =
      relationshipStrength.getStats();

    const otherChildrenCount = parentChildren.length - 1;

    if (
      relationshipType !== EntityRelationshipType.ManyToMany &&
      otherChildrenCount > 0
    ) {
      relationshipStrength.adjust(
        otherChildrenCount * ParentIsAHubPenalty.SIZE
      );
    }
  }
};
