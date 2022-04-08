const { describe, it, expect } = require("@jest/globals");
const parseSchema = require("../app");

describe("engine", () => {
  it("should parse a 1:M relation when there's a reference to an entity in the owned entity", () => {
    const result = parseSchema([
      {
        name: "bids",
        columns: [
          {
            name: "id",
            indices: [
              {
                name: "idPkey",
                isPrimary: true,
              },
            ],
          },
          {
            name: "sum",
            indices: [],
          },
          {
            name: "userId",
            indices: [],
            reference: {
              table: "users",
            },
          },
        ],
      },
      {
        name: "users",
        columns: [
          {
            name: "id",
            indices: [
              {
                name: "idPkey",
                isPrimary: true,
              },
            ],
          },
        ],
      },
    ]);

    expect(result.relations).toEqual([
      {
        origin: "bids",
        destination: "users",
        type: "AGGREGATION",
      },
    ]);
  });
});
