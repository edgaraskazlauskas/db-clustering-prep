// @ts-check

const {
  Graph,
  GraphNode,
  GraphEdge,
  GraphCsvWriter,
  GraphEdgeWeight,
} = require("../../lib/graph");
const {
  EntityTable,
  EntityTableColumn,
  EntityRelationship,
  EntityRelationshipModel,
} = require("../../lib/erm");
const { Database } = require("../../lib/db");
const ExtractionClientConfigBase = require("./../extraction-client-config/ExtractionClientConfigBase");

module.exports = class ExtractionClient {
  /**
   * @param {ExtractionClientConfigBase} config
   */
  constructor(config) {
    this.config = config;
  }

  async extractDatabaseTables() {
    const db = new Database(this.config.getConnection());
    const tables = await db.extractTables();
    return tables;
  }

  /**
   * @param {import('extract-pg-schema').TableOrView[]} extractedTables
   * @returns {EntityRelationshipModel}
   */
  buildEntityRelationshipModel(extractedTables) {
    const model = new EntityRelationshipModel();

    extractedTables.forEach((tableOrView) => {
      model.registerTable(
        new EntityTable(
          tableOrView.name,
          tableOrView.columns.map(
            (column) =>
              new EntityTableColumn(
                column.name,
                column.reference,
                column.indices,
                this.config
                  .getTimestampIndicators()
                  .some((indicator) => column.name.includes(indicator))
              )
          )
        )
      );

      tableOrView.columns
        .filter((column) => !!column.reference)
        .forEach((column) => {
          const relationship = new EntityRelationship(
            tableOrView.name,
            column.reference.table,
            column.indices.some(({ name }) =>
              this.config
                .getUniqueKeyIndicators()
                .some((indicator) => name.includes(indicator))
            ),
            column.indices.some(({ isPrimary }) => isPrimary)
          );

          model.registerRelationship(relationship);
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
   * @param {Graph} graph
   */
  writeGraph(graph) {
    const writer = new GraphCsvWriter(this.config.getName(), graph);
    writer.write();
  }
};
