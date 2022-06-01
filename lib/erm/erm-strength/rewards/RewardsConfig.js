// @ts-check

module.exports = class RewardsConfig {
  /**
   * @param {Number} parentHubPenalty
   * @param {Number} parentOnlyChildReward
   * @param {Number} relationshipPresenceReward
   * @param {Number} leafChildTableReward
   */
  constructor(
    parentHubPenalty,
    parentOnlyChildReward,
    relationshipPresenceReward,
    leafChildTableReward
  ) {
    this.parentHubPenalty = parentHubPenalty;
    this.parentOnlyChildReward = parentOnlyChildReward;
    this.relationshipPresenceReward = relationshipPresenceReward;
    this.leafChildTableReward = leafChildTableReward;
  }
};
