const EntityRelationshipStrength = require("./EntityRelationshipStrength");
const NewbornOfSingleParentReward = require("./rewards/NewbornOfSingleParentReward");
const ParentIsAHubPenalty = require("./rewards/ParentIsAHubPenalty");
const ParentOnlyChildReward = require("./rewards/ParentOnlyChildReward");
const RelationshipPresenceReward = require("./rewards/RelationshipPresenceReward");

module.exports = {
  EntityRelationshipStrength,
  NewbornOfSingleParentReward,
  ParentIsAHubPenalty,
  ParentOnlyChildReward,
  RelationshipPresenceReward,
};
