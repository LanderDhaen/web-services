const supertest = require("supertest");
const createServer = require("../src/createServer");
const { tables, getKnex } = require("../src/data");

const data = {
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
    {
      lessenreeks_id: 3,
      jaargang: "2024-2025",
      nummer: 1,
      startdatum: new Date(2024, 9, 1, 0),
      einddatum: new Date(2024, 12, 30, 0),
    },
  ],
  lessen: [
    {
      les_id: 1,
      datum: new Date(2023, 9, 1, 0),
      lessenreeks_id: 1,
    },
  ],
};

const dataToDelete = {
  lessenreeksen: [1, 2, 3],
  lessen: [1],
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

  const URL = "/api/lessenreeksen";

  describe("GET /api/lessenreeksen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Testcases

    test("should 200 and return all lessenreeksen", async () => {
      const response = await request.get(URL);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        lessenreeks_id: 1,
        jaargang: "2023-2024",
        nummer: 1,
        startdatum: new Date(2023, 9, 1, 0).toJSON(),
        einddatum: new Date(2023, 12, 30, 0).toJSON(),
      });

      expect(response.body.items[1]).toEqual({
        lessenreeks_id: 2,
        jaargang: "2023-2024",
        nummer: 2,
        startdatum: new Date(2024, 1, 1, 0).toJSON(),
        einddatum: new Date(2024, 8, 30, 0).toJSON(),
      });

      expect(response.body.items[2]).toEqual({
        lessenreeks_id: 3,
        jaargang: "2024-2025",
        nummer: 1,
        startdatum: new Date(2024, 9, 1, 0).toJSON(),
        einddatum: new Date(2024, 12, 30, 0).toJSON(),
      });
    });
  });

  // GET /api/lessenreeksen/:id

  describe("GET /api/lessenreeksen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 200 and return the correct lessenreeks", async () => {
      const response = await request.get(`${URL}/1`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        lessenreeks_id: 1,
        jaargang: "2023-2024",
        nummer: 1,
        startdatum: new Date(2023, 9, 1, 0).toJSON(),
        einddatum: new Date(2023, 12, 30, 0).toJSON(),
      });
    });
  });

  // GET /api/lessenreeksen/:id/lessen

  describe("GET /api/lessenreeksen/:id/lessen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen[0]);
      await knex(tables.les).insert(data.lessen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });
    // Test

    test("should 200 and return the lessen of the requested lessenreeks", async () => {
      const response = await request.get(`${URL}/1/lessen`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);

      expect(response.body[0]).toEqual({
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

  // PUT /api/lessenreeksen/:id

  describe("PUT /api/lessenreeksen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 200 and return the updated lessenreeks", async () => {
      const response = await request.put(`${URL}/1`).send({
        jaargang: "2030-2031",
        nummer: 1,
        startdatum: new Date(2030, 9, 1, 0).toJSON(),
        einddatum: new Date(2030, 12, 30, 0).toJSON(),
      });

      expect(response.status).toBe(200);
      expect(response.body.lessenreeks_id).toBeTruthy();
      expect(response.body.jaargang).toBe("2030-2031");
      expect(response.body.nummer).toBe(1);
      expect(response.body.startdatum).toBe(new Date(2030, 9, 1, 0).toJSON());
      expect(response.body.einddatum).toBe(new Date(2030, 12, 30, 0).toJSON());
    });
  });

  // POST /api/lessenreeksen

  describe("POST /api/lessenreeksen", () => {
    const lessenreeksenToDelete = [];

    // Testdata toevoegen aan database niet nodig

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", lessenreeksenToDelete)
        .del();
    });

    // Test

    test("should 201 and return the created lessenreeks", async () => {
      const response = await request.post(URL).send({
        jaargang: "2040-2041",
        nummer: 1,
        startdatum: new Date(2040, 9, 1, 0).toJSON(),
        einddatum: new Date(2040, 12, 30, 0).toJSON(),
      });

      expect(response.status).toBe(201);
      expect(response.body.lessenreeks_id).toBeTruthy();
      expect(response.body.jaargang).toBe("2040-2041");
      expect(response.body.nummer).toBe(1);
      expect(response.body.startdatum).toBe(new Date(2040, 9, 1, 0).toJSON());
      expect(response.body.einddatum).toBe(new Date(2040, 12, 30, 0).toJSON());

      lessenreeksenToDelete.push(response.body.lessenreeks_id);
    });
  });

  // DELETE /api/lessenreeksen/:id

  describe("DELETE /api/lessenreeksen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 204 and return no content", async () => {
      const response = await request.delete(`${URL}/1`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
