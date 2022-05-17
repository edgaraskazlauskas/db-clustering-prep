// @ts-check

const ExtractionClientConfigBase = require("./ExtractionClientConfigBase");

const { Connection } = require("../../db");

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
   */
  constructor(
    name,
    dbhost,
    dbname,
    dbuser,
    dbpassword,
    dbschema,
    weighted = false
  ) {
    super();

    this.name = name;
    this.dbhost = dbhost;
    this.dbname = dbname;
    this.dbuser = dbuser;
    this.dbpassword = dbpassword;
    this.dbschema = dbschema;
    this.weighted = weighted;
  }

  getName() {
    return this.name;
  }

  getIsWeighted() {
    return this.weighted;
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
