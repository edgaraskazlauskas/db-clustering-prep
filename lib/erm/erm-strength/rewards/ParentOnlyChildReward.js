const EntityRelationshipStrengthVisitor = require("../EntityRelationshipStrengthVisitor");
const EntityRelationshipStrength = require("../EntityRelationshipStrength");
const EntityRelationshipType = require("../../EntityRelationshipType");

module.exports = class ParentOnlyChildReward extends (
  EntityRelationshipStrengthVisitor
) {
  static SIZE = 5;

  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   */
  visit(relationshipStrength) {
    const { parentChildren, relationshipType } =
      relationshipStrength.getStats();

    const isManytoMany = relationshipType === EntityRelationshipType.ManyToMany;
    if (isManytoMany) {
      // Don't strengthen ManyToManyRelations? Why?
      return;
    }

    // Check if parent doesn't have other children, if so, then strengthen this relation as the parent is unlikely to be a hub
    const isParentsOnlyChild = parentChildren.length === 1;
    if (isParentsOnlyChild) {
      /**
       * Parent is not related to any other children, means it has no incoming relations.
       * It's most likely a data extension table used to minimize source table size.
       * We could be more certain about it if we also checked if the parent has no parents itself
       * - but IT IS NOT NECESSARY as it may have parents like 'country', 'city', etc.
       * - - these region tables could be joined, but if they have other incoming relations (have children), then they should be split out.
       *
       * user -> profile (PENALIZE) -> country <- (PENALIZE) company
       */
      relationshipStrength.adjust(ParentOnlyChildReward.SIZE);
    }
  }
};
