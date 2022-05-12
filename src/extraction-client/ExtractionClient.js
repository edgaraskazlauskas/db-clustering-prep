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

const Constraint = {
  DataConsistency: "DATA_CONSISTENCY",
};

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
      .map((relationship) => {
        const graphRelationshipStrength =
          this.calculateGraphRelationshipStrength(relationship);
        const userInputModelRelationshipStrength =
          this.calculateUserInputModelRelationshipStrength(relationship);

        return new GraphEdge(
          relationship.child,
          relationship.parent,
          new GraphEdgeWeight(
            graphRelationshipStrength + userInputModelRelationshipStrength
          )
        );
      });

    const graph = new Graph(nodes, edges);
    return graph;
  }

  /**
   * @private
   * @param {EntityRelationship} relationship
   */
  calculateGraphRelationshipStrength(relationship) {
    return relationship.calculateStrength();
  }

  /**
   * @private
   * @param {EntityRelationship} relationship
   */
  calculateUserInputModelRelationshipStrength(relationship) {
    return 0;
    const constraints = [
      {
        entities: ["auction", "auction_bids", "auction_allowed_bidders"],
        type: Constraint.DataConsistency,
        weight: 20,
      },
    ];

    if (relationship.child === "auction_bids") {
      console.debug("bids", {
        entities: [relationship.child, relationship.parent],
        constraint: constraints[0].entities,
      });
    }
    const applicableConstraints = constraints.filter(({ entities }) =>
      [relationship.child, relationship.parent].every((entityName) =>
        entities.includes(entityName)
      )
    );

    return applicableConstraints.reduce((acc, curr) => acc + curr.weight, 0);
  }

  /**
   * @param {Graph} graph
   */
  writeGraph(graph) {
    const writer = new GraphCsvWriter(this.config.getName(), graph);
    writer.write();
  }
};
