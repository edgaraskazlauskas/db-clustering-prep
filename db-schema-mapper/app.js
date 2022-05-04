const writeOutput = require("./modules/io/write-output");
const identifyRelations = require("./modules/relation-identification/identify-relations");
const mapRelationScSchema = require("./modules/relation-mapping/map-relation-sc-schema");
const parsePostgresSchema = require("./modules/schema-parsing/parse-postgres-schema");

function parseSchemaImproved(name, schema) {
  const tableMap = parsePostgresSchema(schema);
  const tableMapWithRelations = identifyRelations(tableMap);
  const scSchema = mapRelationScSchema(tableMapWithRelations);

  writeOutput({
    name,
    entities: scSchema.entities,
    relations: scSchema.relations,
  });

  return scSchema;
}

module.exports = parseSchemaImproved;
