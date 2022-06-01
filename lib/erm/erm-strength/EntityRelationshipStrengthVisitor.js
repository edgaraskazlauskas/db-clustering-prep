// @ts-check
const EntityRelationshipStrength = require("./EntityRelationshipStrength");
const RewardsConfig = require("./rewards/RewardsConfig");

module.exports = class EntityRelationshipStrengthVisitor {
  /**
   * @param {RewardsConfig} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * @param {EntityRelationshipStrength} relationshipStrength
   * @returns {void}
   */
  visit(relationshipStrength) {
    throw new Error("Relationship strength visitor not defined!");
  }
};
