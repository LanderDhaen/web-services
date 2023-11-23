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

  lesgevers: [
    {
      lesgever_id: 3,
      lesgever_naam: "Hannah Van den Steen",
      geboortedatum: new Date(2001, 3, 30, 0),
      type: "Vaste Lesgever",
      aanwezigheidspercentage: 100,
      diploma: "Leerkracht LO",
      imageURL: "",
      email: "lander.dhaen@move-united.be",
      GSM: "0499999999",
      groep_id: 3,
    },
  ],

  lesvoorbereidingen: [
    {
      lesvoorbereiding_id: 1,
      lesvoorbereiding_naam: "Walter de Walrus gaat naar school",
      lesvoorbereiding_type: "Gewone Les",
      link_to_PDF: "https://www.google.com",
      feedback: "Dit is een test",
      les_id: 1,
      groep_id: 3,
    },
  ],

  lessen: [
    {
      les_id: 1,
      datum: new Date(2023, 9, 1, 0),
      lessenreeks_id: 1,
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
  ],
};

const dataToDelete = {
  groepen: [1, 2, 3],
  lesgevers: [3],
  lesvoorbereidingen: [1],
  lessen: [1],
  lessenreeksen: [1],
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

  // GET /groepen/:id/lesgevers

  describe("GET /api/groepen/:id/lesgevers", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the lesgevers of the requested groep", async () => {
      const response = await request.get(`${URL}/3/lesgevers`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual({
        lesgever_id: 3,
        lesgever_naam: "Hannah Van den Steen",
        geboortedatum: new Date(2001, 3, 30, 0).toISOString(),
        type: "Vaste Lesgever",
        aanwezigheidspercentage: 100,
        diploma: "Leerkracht LO",
        imageURL: "",
        email: "lander.dhaen@move-united.be",
        GSM: "0499999999",
        groep: {
          groep_id: 3,
          groep_naam: "Waterschildpadden",
          beschrijving: "Watergewenning, ontdekken diep",
          aantal_lesgevers: 1,
        },
      });
    });
  });

  // GET /api/groepen/:id/lesvoorbereidingen

  describe("GET /api/groepen/:id/lesvoorbereidingen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesvoorbereiding).insert(data.lesvoorbereidingen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", dataToDelete.lesvoorbereidingen)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
    });

    // Test

    test("should 200 and return the lesvoorbereidingen of the requested groep", async () => {
      const response = await request.get(`${URL}/3/lesvoorbereidingen`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual({
        lesvoorbereiding_id: 1,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar school",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les_id: 1,
        groep: {
          groep_id: 3,
          groep_naam: "Waterschildpadden",
          beschrijving: "Watergewenning, ontdekken diep",
          aantal_lesgevers: 1,
        },
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

  // DELETE /api/groepen/:id

  describe("DELETE /api/groepen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 204 and return nothing", async () => {
      const response = await request.delete(`${URL}/1`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
