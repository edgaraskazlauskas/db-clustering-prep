const { describe, it, expect } = require("@jest/globals");
const parseSchema = require("../app");

describe("One to one relation parser", () => {
  it("should detect a one to one relation for users and user settings", () => {
    const result = parseSchema([
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
      {
        name: "userSettings",
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
            name: "userId",
            indices: [
              {
                name: "userIdUQ", // Note the UQ index
                isPrimary: false,
              },
            ],
            reference: {
              table: "users",
            },
          },
        ],
      },
    ]);

    expect(result.relations).toEqual([
      {
        origin: "userSettings",
        destination: "users",
        type: "COMPOSITION",
      },
    ]);
  });

  it("should detect a one to one relation for users and user settings when reference is on owner side", () => {
    const result = parseSchema([
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
          {
            name: "settingsId",
            indices: [
              // UNIQUE, otherwise this is a many to one and therefore not really composition
              {
                name: "settingsIdUQ",
                isPrimary: true,
              },
            ],
            reference: {
              table: "userSettings",
            },
          },
        ],
      },
      {
        name: "userSettings",
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
        origin: "users",
        destination: "userSettings",
        type: "COMPOSITION",
      },
    ]);
  });

  it("should detect actual owner of the composition relation by foreign key count", () => {
    const result = parseSchema([
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
      {
        name: "userProfile",
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
            name: "userId",
            indices: [
              // UNIQUE, otherwise this is a many to one and therefore not really composition
              {
                name: "userIdUQ",
                isPrimary: true,
              },
            ],
            reference: {
              table: "users",
            },
          },
        ],
      },
      {
        name: "userSettings",
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
            name: "userId",
            indices: [
              // UNIQUE, otherwise this is a many to one and therefore not really composition
              {
                name: "userIdUQ",
                isPrimary: true,
              },
            ],
            reference: {
              table: "users",
            },
          },
        ],
      },
    ]);

    expect(result.relations).toEqual([
      {
        origin: "userProfile",
        destination: "users",
        type: "COMPOSITION",
      },
      {
        origin: "userSettings",
        destination: "users",
        type: "COMPOSITION",
      },
    ]);
  });

  it("should detect actual owner of the composition relation by foreign key count when references are on owner side", () => {
    const result = parseSchema([
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
          {
            name: "profileId",
            indices: [
              // UNIQUE, otherwise this is a many to one and therefore not really composition
              {
                name: "profileIdUQ",
                isPrimary: true,
              },
            ],
            reference: {
              table: "userProfile",
            },
          },
        ],
      },
      {
        name: "userProfile",
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
      {
        name: "userSettings",
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
            name: "userId",
            indices: [
              {
                name: "userIdUQ",
                isPrimary: true,
              },
            ],
            reference: {
              table: "users",
            },
          },
        ],
      },
      {
        name: "orders",
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
            name: "userId",
            indices: [],
            reference: {
              table: "users",
            },
          },
        ],
      },
    ]);

    expect(result.relations).toEqual([
      {
        origin: "userProfile",
        destination: "users",
        type: "COMPOSITION",
      },
      {
        origin: "userSettings",
        destination: "users",
        type: "COMPOSITION",
      },
      {
        origin: "orders",
        destination: "users",
        type: "AGGREGATION",
      },
    ]);
  });
});
