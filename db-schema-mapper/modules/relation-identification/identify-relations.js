const RelationType = {
  OneToOne: "1 to 1",
  OneToMany: "1 to many",
  ManyToOne: "Many to one",
  ManyToMany: "Many to many",
};

const DATESTAMP_COLUMN_NAMES = ["modifieddate"];

function columnHasReference({ reference }) {
  return !!reference;
}

function columnIsNotDatestamp({ name }) {
  return !DATESTAMP_COLUMN_NAMES.includes(name);
}

function isManyToManyRelationTable(tableName, tableMap) {
  const refTable = tableMap[tableName];

  const relevantColumns = refTable.columns.filter(columnIsNotDatestamp);
  const hasTwoColumnsAndTheyAreFk =
    relevantColumns.length === 2 && relevantColumns.every(columnHasReference);

  return hasTwoColumnsAndTheyAreFk;
}

function isOneToOneTwoWayRelationTable(tableName, relationTableName, tableMap) {
  return (
    relationTableName in tableMap[tableName] &&
    tableName in tableMap[relationTableName].relations
  );
}

function isOneToOneRelationTable(tableName, relationTableName, tableMap) {
  if (
    tableMap[tableName].relations[relationTableName].isUnique ||
    tableMap[tableName].relations[relationTableName].isPrimary
  ) {
    // PK enforces uniqueness
    // Unless there's a non unique ref to this table back in the other table, which we cover with case #1. But from this tables POV, this is 1:1
    return true;
  }

  return false;
}

module.exports = function identifyRelations(tableMap) {
  for (const tableName of Object.keys(tableMap)) {
    for (const relationTableName of Object.keys(
      tableMap[tableName].relations
    )) {
      if (
        isOneToOneTwoWayRelationTable(tableName, relationTableName, tableMap)
      ) {
        // 1:1 FOR SURE, but who is the owner? Maybe the one who has more FKs
        tableMap[tableName].relations[relationTableName].relationType =
          RelationType.OneToOne;
        continue;
      }

      if (isManyToManyRelationTable(tableName, tableMap)) {
        tableMap[tableName].isJunctionTable = true;
        tableMap[tableName].relations[relationTableName].relationType =
          RelationType.ManyToMany;
        continue;
      }

      if (isOneToOneRelationTable(tableName, relationTableName, tableMap)) {
        tableMap[tableName].relations[relationTableName].relationType =
          RelationType.OneToOne;
        continue;
      }

      // Many is always on the side where the key is as many entries can lead to one.
      // If the key is unique
      tableMap[tableName].relations[relationTableName].relationType =
        RelationType.ManyToOne;
    }
  }

  return tableMap;
};
