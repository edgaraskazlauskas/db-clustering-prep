// @ts-check

const ExtractionClientConfigBase = require("./ExtractionClientConfigBase");

const { Config } = require("./../../lib/config");
const { Connection } = require("./../../lib/db");

module.exports = class EnvExtractionClientConfig extends (
  ExtractionClientConfigBase
) {
  constructor() {
    super();

    this.config = new Config();
  }

  getName() {
    return this.config.get("DB_NAME");
  }

  getConnection() {
    const connection = new Connection(
      this.config.get("DB_HOST"),
      this.config.get("DB_NAME"),
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_SCHEMA")
    );

    return connection;
  }

  getUniqueKeyIndicators() {
    return this.config.get("DB_UNIQUE_INDEX_INDICATORS");
  }

  getTimestampIndicators() {
    return this.config.get("DB_TIMESTAMP_COLUMN_INDICATORS");
  }
};
