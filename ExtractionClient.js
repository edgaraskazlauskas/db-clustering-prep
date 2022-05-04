// @ts-check

const {
  Graph,
  GraphNode,
  GraphEdge,
  GraphCsvWriter,
  GraphEdgeWeight,
} = require("./lib/graph");
const {
  EntityTable,
  EntityRelationship,
  EntityRelationshipModel,
} = require("./lib/erm");
const { Database, Connection } = require("./lib/db");

module.exports.Connection = Connection;

module.exports = class ExtractionClient {
  /**
   * @private
   */
  name;

  /**
   * @private
   */
  connection;

  /**
   * @param {String} name
   * @param {Connection} connection
   */
  constructor(name, connection) {
    this.name = name;
    this.connection = connection;
  }

  async extractDatabaseTables() {
    const db = new Database(this.connection);
    const tables = await db.extractTables();
    return tables;
  }

  /**
   *
   * @param {import('extract-pg-schema').TableOrView[]} extractedTables
   * @returns {EntityRelationshipModel}
   */
  buildEntityRelationshipModel(extractedTables) {
    const model = new EntityRelationshipModel();

    extractedTables.forEach((tableOrView) => {
      model.registerTable(new EntityTable(tableOrView.name));

      tableOrView.columns
        .filter((column) => !!column.reference)
        .forEach((column) => {
          model.registerRelationship(
            new EntityRelationship(tableOrView.name, column.reference.table)
          );
        });
    });

    return model;
  }

  /**
   * @param {EntityRelationshipModel} entityRelationshipModel
   */
  buildGraph(entityRelationshipModel) {
    const nodes = entityRelationshipModel
      .getEntities()
      .map((entity) => new GraphNode(entity.name));

    const edges = entityRelationshipModel
      .getRelationships()
      .map(
        (relationship) =>
          new GraphEdge(
            relationship.child,
            relationship.parent,
            new GraphEdgeWeight(relationship.strength)
          )
      );

    const graph = new Graph(nodes, edges);
    return graph;
  }

  /**
   *
   * @param {Graph} graph
   */
  writeGraph(graph) {
    const writer = new GraphCsvWriter(this.name, graph);
    writer.write();
  }
};
