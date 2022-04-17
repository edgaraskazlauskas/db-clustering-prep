const mappedSchemaName = "auction-api";

const input = require(`../db-schema-mapper/sample-results/${mappedSchemaName}.json`);
const fs = require("fs");

const output = [];

const POINTS_PER_RELATION = 5;
const INCOMING_RELATION_PENALTY = 3; // Should be less than points per relation.
const DATA_CONSISTENCY_PENALTY = 20;
const ONLY_RELATION_BONUS = 50; //
// How many relations should the target entity have for it to be considered non attachable?

for (const entity of input.entities) {
  output.push({
    data: {
      id: entity.name,
    },
  });
}

for (const relation of input.relations) {
  output.push({
    data: {
      id: `${relation.origin}_${relation.destination}`,
      source: relation.origin,
      target: relation.destination,
      closeness: (() => {
        let closeness = POINTS_PER_RELATION;

        // given this is the only relation of the entity, grant it a bonus as the likelyhood is large that this belongs to it
        // to avoid connections to large other domain entities, this must not be so large that incoming relation bonus doesn't work anymore
        const sourceRelationsCount = input.relations.filter(
          ({ origin }) => origin === relation.origin
        ).length;
        console.warn("only relation", relation.origin, sourceRelationsCount);
        if (sourceRelationsCount === 1) {
          closeness += ONLY_RELATION_BONUS;
        }

        // depends on # of incoming FKs in the target entity. Each incoming FK in target entity lowers score by {ratio}.
        const targetRelationsCount = input.relations.filter(
          ({ origin, destination }) =>
            destination === relation.destination &&
            origin !== origin.destination // exclude current relation
        ).length;
        closeness -= targetRelationsCount * INCOMING_RELATION_PENALTY;

        const isDataConsistencyConstraintActive = false;
        if (isDataConsistencyConstraintActive) {
          closeness -= DATA_CONSISTENCY_PENALTY;
        }

        return closeness >= 0 ? closeness : 0;
      })(),
    },
  });
}

try {
  fs.mkdirSync("outputs");
} catch (e) {
  // ignore
}

fs.writeFileSync(
  `outputs/${mappedSchemaName}.json`,
  JSON.stringify(output, null, 2)
);
