const supertest = require("supertest");
const createServer = require("../../src/createServer");
const { tables, getKnex } = require("../../src/data");

const data = {
  lessen: [
    {
      les_id: 1,
      datum: new Date(2023, 9, 1, 0),
      lessenreeks_id: 1,
    },
    {
      les_id: 15,
      datum: new Date(2023, 12, 30, 0),
      lessenreeks_id: 1,
    },
    {
      les_id: 7,
      datum: new Date(2024, 4, 23, 0),
      lessenreeks_id: 2,
    },
  ],

  lessenreeksen: [
    {
      lessenreeks_id: 1,
      jaargang: "2023-2024",
      nummer: 1,
      startdatum: new Date(2023, 9, 1, 0),
      einddatum: new Date(2023, 12, 30, 0),
    },
    {
      lessenreeks_id: 2,
      jaargang: "2023-2024",
      nummer: 2,
      startdatum: new Date(2024, 1, 1, 0),
      einddatum: new Date(2024, 8, 30, 0),
    },
  ],
};

const dataToDelete = {
  lessenreeksen: [1, 2],
  lessen: [1, 15, 7],
};

describe("Lessenreeksen", () => {
  let server;
  let request;
  let knex;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  const URL = "/api/lessen";

  describe("GET /api/lessen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    test("should 200 and return all lessen", async () => {
      const response = await request.get(URL);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        les_id: 1,
        datum: new Date(2023, 9, 1, 0).toJSON(),
        lessenreeks: {
          lessenreeks_id: 1,
          jaargang: "2023-2024",
          nummer: 1,
          startdatum: new Date(2023, 9, 1, 0).toJSON(),
          einddatum: new Date(2023, 12, 30, 0).toJSON(),
        },
      });

      expect(response.body.items[1]).toEqual({
        les_id: 7,
        datum: new Date(2024, 4, 23, 0).toJSON(),
        lessenreeks: {
          lessenreeks_id: 2,
          jaargang: "2023-2024",
          nummer: 2,
          startdatum: new Date(2024, 1, 1, 0).toJSON(),
          einddatum: new Date(2024, 8, 30, 0).toJSON(),
        },
      });

      expect(response.body.items[2]).toEqual({
        les_id: 15,
        datum: new Date(2023, 12, 30, 0).toJSON(),
        lessenreeks: {
          lessenreeks_id: 1,
          jaargang: "2023-2024",
          nummer: 1,
          startdatum: new Date(2023, 9, 1, 0).toJSON(),
          einddatum: new Date(2023, 12, 30, 0).toJSON(),
        },
      });
    });
  });

  // GET /api/lessen/:id

  describe("GET /api/lessen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    test("should 200 and return the requested les", async () => {
      const response = await request.get(`${URL}/1`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        les_id: 1,
        datum: new Date(2023, 9, 1, 0).toJSON(),
        lessenreeks: {
          lessenreeks_id: 1,
          jaargang: "2023-2024",
          nummer: 1,
          startdatum: new Date(2023, 9, 1, 0).toJSON(),
          einddatum: new Date(2023, 12, 30, 0).toJSON(),
        },
      });
    });
  });

  // PUT /api/lessen/:id

  describe("PUT /api/lessen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 200 and return the updated les", async () => {
      const response = await request.put(`${URL}/1`).send({
        datum: new Date(2033, 10, 1, 0),
        lessenreeks_id: 2,
      });

      expect(response.status).toBe(200);
      expect(response.body.les_id).toBeTruthy();
      expect(response.body.datum).toEqual(new Date(2033, 10, 1, 0).toJSON());
      expect(response.body.lessenreeks.lessenreeks_id).toEqual(2);
      expect(response.body.lessenreeks.jaargang).toEqual("2023-2024");
      expect(response.body.lessenreeks.nummer).toEqual(2);
      expect(response.body.lessenreeks.startdatum).toEqual(
        new Date(2024, 1, 1, 0).toJSON()
      );
      expect(response.body.lessenreeks.einddatum).toEqual(
        new Date(2024, 8, 30, 0).toJSON()
      );
    });
  });

  // POST /api/lessen

  describe("POST /api/lessen", () => {
    const lessenToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", lessenToDelete).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 201 and return the created les", async () => {
      const response = await request.post(URL).send({
        datum: new Date(2043, 10, 1, 0),
        lessenreeks_id: 2,
      });

      expect(response.status).toBe(201);
      expect(response.body.les_id).toBeTruthy();
      expect(response.body.datum).toEqual(new Date(2043, 10, 1, 0).toJSON());
      expect(response.body.lessenreeks.lessenreeks_id).toBe(2);
      expect(response.body.lessenreeks.jaargang).toEqual("2023-2024");
      expect(response.body.lessenreeks.nummer).toBe(2);
      expect(response.body.lessenreeks.startdatum).toEqual(
        new Date(2024, 1, 1, 0).toJSON()
      );
      expect(response.body.lessenreeks.einddatum).toEqual(
        new Date(2024, 8, 30, 0).toJSON()
      );

      lessenToDelete.push(response.body.les_id);
    });
  });

  // DELETE /api/lessen/:id

  describe("DELETE /api/lessen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 204 and return nothing", async () => {
      const response = await request.delete(`${URL}/1`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
