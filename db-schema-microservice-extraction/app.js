const writeOutput = require("./modules/io/write-output");
const identifyRelations = require("./modules/relation-identification/identify-relations");
const mapRelationScSchema = require("./modules/relation-mapping/map-relation-sc-schema");
const parsePostgresSchema = require("./modules/schema-parsing/parse-postgres-schema");

function parseSchemaImproved(schema) {
  const tableMap = parsePostgresSchema(schema);
  const tableMapWithRelations = identifyRelations(tableMap);
  const scSchema = mapRelationScSchema(tableMapWithRelations);

  writeOutput({
    name: "test",
    entities: scSchema.entities,
    relations: scSchema.relations,
  });

  return scSchema;
}

module.exports = parseSchemaImproved;

/**
 * TODO: Decide if there's a unique constraint (to find 1:1 relations) by unique or primary key indexes on foreign keys.
 * TODO: Map all relationships of all kinds to aggregate or composite relations, ignoring the actual relation type.
 * NEXT: 1:1 is composite (same lifecycle), 1:M is aggregate (same domain, semantic proximity).
 * NOTE: Composition entities are very likely with few foreign keys. But it's hard to tell.
 */
