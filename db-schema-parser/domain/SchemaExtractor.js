//@ts-check

const SchemaParser = require("./SchemaParser");
const SchemaWriter = require("./SchemaWriter");

module.exports = class SchemaExtractor {
  /**
   * @property {SchemaParser}
   * @private
   */
  parser;

  /**
   * @property {SchemaWriter}
   * @private
   */
  writer;

  /**
   * @param {SchemaParser} parser
   * @param {SchemaWriter} writer
   */
  constructor(parser, writer) {
    this.parser = parser;
    this.writer = writer;
  }

  async extract() {
    const tables = await this.parser.parse();
    await this.writer.write(tables);
  }
};
