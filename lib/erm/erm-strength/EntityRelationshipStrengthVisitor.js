const EntityRelationshipStrength = require("./EntityRelationshipStrength");

module.exports = class EntityRelationshipStrengthVisitor {
  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   * @returns {void}
   */
  visit(relationshipStrength) {
    throw new Error("Relationship strength visitor not defined!");
  }
};
