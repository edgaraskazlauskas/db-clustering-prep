const EntityRelationshipStrength = require("./EntityRelationshipStrength");
const LeafChildTableReward = require("./rewards/LeafChildTableReward");
const ParentIsAHubPenalty = require("./rewards/ParentIsAHubPenalty");
const ParentOnlyChildReward = require("./rewards/ParentOnlyChildReward");
const RelationshipPresenceReward = require("./rewards/RelationshipPresenceReward");
const RewardsConfig = require("./rewards/RewardsConfig");

module.exports = {
  EntityRelationshipStrength,
  LeafChildTableReward,
  ParentIsAHubPenalty,
  ParentOnlyChildReward,
  RelationshipPresenceReward,
  RewardsConfig,
};
