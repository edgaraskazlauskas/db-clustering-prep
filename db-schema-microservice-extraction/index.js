const schema = require("./sample-schemas/adventureworks.json");
const parseSchema = require("./app");

parseSchema(schema);

/**
 * TODO: Decide if there's a unique constraint (to find 1:1 relations) by unique or primary key indexes on foreign keys.
 * TODO: Map all relationships of all kinds to aggregate or composite relations, ignoring the actual relation type.
 * NEXT: 1:1 is composite (same lifecycle), 1:M is aggregate (same domain, semantic proximity).
 * NOTE: Composition entities are very likely with few foreign keys. But it's hard to tell.
 */
