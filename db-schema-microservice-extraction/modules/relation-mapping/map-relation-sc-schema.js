const RelationType = {
  OneToOne: "1 to 1",
  OneToMany: "1 to many",
  ManyToOne: "Many to one",
  ManyToMany: "Many to many",
};

const DATESTAMP_COLUMN_NAMES = ["modifieddate"];

function columnIsNotDatestamp({ name }) {
  return !DATESTAMP_COLUMN_NAMES.includes(name);
}

module.exports = function mapRelationServiceCutterSchema(tableMap) {
  const allRelations = [];
  const allEntities = [];

  for (const tableName of Object.keys(tableMap)) {
    const table = tableMap[tableName];
    if (!table.isJunctionTable) {
      allEntities.push({
        name: tableName,
        nanoentities: table.columns.map(({ name }) => name),
      });
    }

    for (const tableRelationName of Object.keys(
      tableMap[tableName].relations
    )) {
      const tableRelation = tableMap[tableRelationName];
      const tableRelationColumn =
        tableMap[tableName].relations[tableRelationName];

      switch (tableRelationColumn.relationType) {
        case RelationType.ManyToMany:
          // This will cause the dependency to be 2 sided, maybe not what we want
          const [columnLeft, columnRight] =
            table.columns.filter(columnIsNotDatestamp);

          if (columnLeft.reference.table === tableRelationName) {
            allRelations.push({
              origin: columnLeft.reference.table,
              destination: columnRight.reference.table,
              type: "AGGREGATION",
            });
          } else {
            allRelations.push({
              origin: columnRight.reference.table,
              destination: columnLeft.reference.table,
              type: "AGGREGATION",
            });
          }
          break;

        case RelationType.OneToOne:
          // 1:1
          // Su 1:1 relationais esme tame, kad:
          // Owneris dazniausiai neturi FK ir turi daugiau incoming FK
          // -- Bet jeigu turi, tai jis turi buti pazymetas UQ indeksu IR owneris turi tureti daugiau FK

          const isTableWithMoreIncomingFk =
            // Object.keys(tableIncomingFksMap[referenceTableName]).length === 0 ||
            table.incomingFk > tableRelation.incomingFk;

          if (isTableWithMoreIncomingFk) {
            allRelations.push({
              origin: tableRelationName,
              destination: tableName,
              type: "COMPOSITION",
            });
          } else {
            allRelations.push({
              origin: tableName,
              destination: tableRelationName,
              type: "COMPOSITION",
            });
          }
          break;

        case RelationType.OneToMany:
          // Su 1:m relationais esme tame, kad:
          // Owneris dazniausiai neturi FK
          // -- Bet jeigu turi, tai jis turi buti NEPAZYMETAS UQ indeksu ir tada owneris yra M puse

          // User owns bids
          allRelations.push({
            origin: tableName, // THE ONE WHO REFERENCES IS USUALLY OWNED BY THE REFERENCE
            destination: tableRelationName,
            type: "AGGREGATION",
          });
          break;

        case RelationType.ManyToOne:
          // Bid belongs to user, user can reference many bids
          allRelations.push({
            origin: tableName,
            destination: tableRelationName, // THE ONE WHO REFERENCES IS USUALLY OWNED BY THE REFERENCE
            type: "AGGREGATION",
          });
          break;

        default:
          break;
      }
    }
  }

  return {
    name: "sample-db",
    entities: allEntities,
    relations: allRelations,
  };
};
