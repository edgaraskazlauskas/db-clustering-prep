// @ts-check

module.exports = class Connection {
  /**
   * @type {String}
   * @public
   */
  host;

  /**
   * @type {String}
   * @public
   */
  database;

  /**
   * @type {String}
   * @public
   */
  user;

  /**
   * @type {String}
   * @public
   */
  password;

  /**
   * @type {String | String[]}
   * @public
   */
  schema;

  /**
   * @param {String} host
   * @param {String} database
   * @param {String} user
   * @param {String} password
   * @param {String | String[]} schema
   */
  constructor(host, database, user, password, schema) {
    this.host = host;
    this.database = database;
    this.user = user;
    this.password = password;
    this.schema = schema;
  }
};
