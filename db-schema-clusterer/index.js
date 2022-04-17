const cluster = require("set-clustering");
const set = require("../graph-model-builder/outputs/auction-api.json");

const relationsMap = set
  .filter(({ data: { source, target } }) => source && target)
  .reduce((acc, { data: { source, target, closeness } }) => {
    if (!acc[source]) {
      acc[source] = {};
    }

    acc[source][target] = closeness;

    return acc;
  }, {});

function similarity(x, y) {
  return relationsMap[x]?.[y] || relationsMap[y]?.[x] || 0;
}

console.log(
  cluster(
    set
      .filter(({ data: { source, target } }) => !source && !target)
      .map(({ data: { id } }) => id),
    similarity
  ).groups(2)
);
