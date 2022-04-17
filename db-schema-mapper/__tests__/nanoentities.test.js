const parseSchema = require("../app");

describe("Nanoentities parser", () => {
  it("shold parse all regular nanoentities", () => {
    const result = parseSchema([
      {
        name: "bids",
        columns: [
          {
            name: "sum",
            indices: [],
          },
          {
            name: "userId",
            indices: [],
          },
        ],
      },
      {
        name: "users",
        columns: [
          {
            name: "id",
            indices: [],
          },
        ],
      },
    ]);

    expect(result.entities).toEqual([
      {
        name: "bids",
        nanoentities: ["sum", "userId"],
      },
      {
        name: "users",
        nanoentities: ["id"],
      },
    ]);
  });

  it("should not parse intermediary table used for many to many relation", () => {
    const result = parseSchema([
      {
        name: "bids",
        columns: [
          {
            name: "sum",
            indices: [],
          },
        ],
      },
      {
        name: "users",
        columns: [
          {
            name: "id",
            indices: [],
          },
        ],
      },
      {
        name: "userBids",
        columns: [
          {
            name: "userId",
            indices: [],
            reference: {
              table: "users",
            },
          },
          {
            name: "bidId",
            indices: [],
            reference: {
              table: "bids",
            },
          },
        ],
      },
    ]);

    expect(result.entities).toEqual([
      {
        name: "bids",
        nanoentities: ["sum"],
      },
      {
        name: "users",
        nanoentities: ["id"],
      },
    ]);
  });
});
