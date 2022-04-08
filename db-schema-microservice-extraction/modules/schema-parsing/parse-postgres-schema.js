/**
 * Parses schema to internal format convenient for parsing relations.
 *
 * Sample output:
 * {
 *   users: {
 *     columns: [
 *       {
 *         name: "settingsId",
 *         isUnique: true,
 *         isPrimary: false
 *       }
 *     ],
 *     relations: {
 *       settings: {
 *         // settingsIdColumn
 *       }
 *     },
 *     incomingFk: 0,
 *     outgoingFk: 1
 *   },
 * }
 */
const UNIQUE_INDEX_COLUMN_SUFFIX = "UQ";
const mapColumn = ({ name, indices, reference }) => ({
  name,
  reference,
  // TODO might be that if index exists, it's unique
  indicesName: indices.map(({ name }) => name).join(", "),
  isUnique: indices.some(({ name }) =>
    name.includes(UNIQUE_INDEX_COLUMN_SUFFIX)
  ),
  isPrimary: indices.some(({ isPrimary }) => isPrimary),
  relationType: null,
});

module.exports = function parsePostgresSchema(schema) {
  const tableMap = {};

  schema.forEach((table) => {
    // Set up columns
    tableMap[table.name] = {
      columns: table.columns.map(mapColumn),
      isJunctionTable: false,
      relations: {},
      incomingFk: 0,
      outgoingFk: 0,
    };

    // Set up relations
    table.columns.forEach((column) => {
      if (column.reference) {
        tableMap[table.name].relations[column.reference.table] =
          mapColumn(column);
      }
    });

    // Set up table outgoing fk count
    const outgoingFk = table.columns.filter((column) => column.reference);
    tableMap[table.name].outgoingFk = outgoingFk.length;
  });

  // Set up table incoming fk count
  schema.forEach((table) => {
    const incomingFk = Object.keys(tableMap)
      .map((otherTableName) =>
        // If iteratee in refs of other table
        table.name in tableMap[otherTableName].relations ? otherTableName : null
      )
      .filter((tableNameOrNull) => Boolean(tableNameOrNull));
    tableMap[table.name].incomingFk = incomingFk.length;
  });

  return tableMap;
};
