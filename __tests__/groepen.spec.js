const supertest = require("supertest");
const createServer = require("../src/createServer");
const { tables, getKnex } = require("../src/data");

const data = {
  groepen: [
    {
      groep_id: 1,
      groep_naam: "Eendjes",
      beschrijving: "Startgroep, met ouders",
      aantal_lesgevers: 0,
    },
    {
      groep_id: 2,
      groep_naam: "Pinguïns",
      beschrijving: "Startgroep, zonder ouders",
      aantal_lesgevers: 0,
    },
    {
      groep_id: 3,
      groep_naam: "Waterschildpadden",
      beschrijving: "Watergewenning, ontdekken diep",
      aantal_lesgevers: 1,
    },
  ],
};

const dataToDelete = {
  groepen: [1, 2, 3],
};

describe("Groepen", () => {
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

  const URL = "/api/groepen";

  describe("GET /api/groepen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return all groepen", async () => {
      const response = await request.get(URL);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        groep_id: 1,
        groep_naam: "Eendjes",
        beschrijving: "Startgroep, met ouders",
        aantal_lesgevers: 0,
      });

      expect(response.body.items[1]).toEqual({
        groep_id: 2,
        groep_naam: "Pinguïns",
        beschrijving: "Startgroep, zonder ouders",
        aantal_lesgevers: 0,
      });

      expect(response.body.items[2]).toEqual({
        groep_id: 3,
        groep_naam: "Waterschildpadden",
        beschrijving: "Watergewenning, ontdekken diep",
        aantal_lesgevers: 1,
      });
    });
  });

  // GET /api/groepen/:id

  describe("GET /api/groepen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the requested groep", async () => {
      const response = await request.get(`${URL}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        groep_id: 1,
        groep_naam: "Eendjes",
        beschrijving: "Startgroep, met ouders",
        aantal_lesgevers: 0,
      });
    });
  });

  // PUT /api/groepen/:id

  describe("PUT /api/groepen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the updated groep", async () => {
      const response = await request.put(`${URL}/1`).send({
        groep_naam: "Eendjes 2.0",
        beschrijving: "Startgroep, met ouders 2.0",
        aantal_lesgevers: 8,
      });

      expect(response.status).toBe(200);
      expect(response.body.groep_id).toBeTruthy();
      expect(response.body.groep_naam).toBe("Eendjes 2.0");
      expect(response.body.beschrijving).toBe("Startgroep, met ouders 2.0");
      expect(response.body.aantal_lesgevers).toBe(8);
    });
  });

  // POST /api/groepen

  describe("POST /api/groepen", () => {
    const groepenToDelete = [];

    // Testdata toevoegen aan database niet nodig

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", groepenToDelete).del();
    });

    // Test

    test("should 201 and return the created groep", async () => {
      const response = await request.post(URL).send({
        groep_naam: "Haaien",
        beschrijving: "Competitiegroep",
        aantal_lesgevers: 5,
      });

      expect(response.status).toBe(201);
      expect(response.body.groep_id).toBeTruthy();
      expect(response.body.groep_naam).toBe("Haaien");
      expect(response.body.beschrijving).toBe("Competitiegroep");
      expect(response.body.aantal_lesgevers).toBe(5);

      groepenToDelete.push(response.body.groep_id);
    });
  });
});
