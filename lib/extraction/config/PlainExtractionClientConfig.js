// @ts-check

const ExtractionClientConfigBase = require("./ExtractionClientConfigBase");

const { Connection } = require("../../db");
const { RewardsConfig } = require("../../erm/erm-strength");

module.exports = class PlainExtractionClientConfig extends (
  ExtractionClientConfigBase
) {
  /**
   *
   * @param {String} name
   * @param {String} dbhost
   * @param {String} dbname
   * @param {String} dbuser
   * @param {String} dbpassword
   * @param {String} dbschema
   * @param {Boolean} [weighted]
   * @param {Number} [parentHubPenalty]
   * @param {Number} [parentOnlyChildReward]
   * @param {Number} [relationshipPresenceReward]
   * @param {Number} [leafChildTableReward]
   */
  constructor(
    name,
    dbhost,
    dbname,
    dbuser,
    dbpassword,
    dbschema,
    weighted = false,
    parentHubPenalty = 10,
    parentOnlyChildReward = 5,
    relationshipPresenceReward = 10,
    leafChildTableReward = 5
  ) {
    super();

    this.name = name;
    this.dbhost = dbhost;
    this.dbname = dbname;
    this.dbuser = dbuser;
    this.dbpassword = dbpassword;
    this.dbschema = dbschema;
    this.weighted = weighted;

    this.rewardsConfig = new RewardsConfig(
      parentHubPenalty,
      parentOnlyChildReward,
      relationshipPresenceReward,
      leafChildTableReward
    );
  }

  getName() {
    return this.name;
  }

  getIsWeighted() {
    return this.weighted;
  }

  getRewardsConfig() {
    return this.rewardsConfig;
  }

  getConnection() {
    const connection = new Connection(
      this.dbhost,
      this.dbname,
      this.dbuser,
      this.dbpassword,
      this.dbschema
    );

    return connection;
  }

  getUniqueKeyIndicators() {
    return ["unique"];
  }

  getTimestampIndicators() {
    return ["modifeddate", "last_update"];
  }
};
