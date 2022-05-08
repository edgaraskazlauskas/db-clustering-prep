// @ts-check

const ExtractionClientConfigBase = require("./ExtractionClientConfigBase");

const { Connection } = require("./../../lib/db");

module.exports = class PlainExtractionClientConfig extends (
  ExtractionClientConfigBase
) {
  constructor(name, dbhost, dbname, dbuser, dbpassword, dbschema) {
    super();

    this.name = name;
    this.dbhost = dbhost;
    this.dbname = dbname;
    this.dbuser = dbuser;
    this.dbpassword = dbpassword;
    this.dbschema = dbschema;
  }

  getName() {
    return this.name;
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
