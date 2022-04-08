const { describe, it, expect } = require("@jest/globals");
const parseSchema = require("../app");

describe("engine", () => {
  it("should parse a M:M relation when there's an intermediary table", () => {
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

    expect(result.relations).toEqual([
      {
        origin: "users",
        destination: "bids",
        type: "AGGREGATION",
      },
      {
        origin: "bids",
        destination: "users",
        type: "AGGREGATION",
      },
    ]);
  });

  it("should parse a M:M relation and map it to a M:1 relation", () => {
    const result = parseSchema([
      {
        name: "books",
        columns: [],
      },
      {
        name: "publishers",
        columns: [],
      },
      {
        name: "bookPublishers",
        columns: [
          {
            name: "format", // ebook, paperback, hardcover
            indices: [],
          },
          {
            name: "bookId",
            indices: [],
            reference: {
              table: "publishers",
            },
          },
          {
            name: "publisherId",
            indices: [],
            reference: {
              table: "books",
            },
          },
        ],
      },
    ]);

    // Currently it's set so that bookPublishers is owned by the 2 tables
    // TODO maybe inverted order so that bookPublisher owns publisher
    expect(result.relations).toEqual([
      {
        origin: "bookPublishers",
        destination: "publishers",
        type: "AGGREGATION",
      },
      {
        origin: "bookPublishers",
        destination: "books",
        type: "AGGREGATION",
      },
    ]);
  });
});
