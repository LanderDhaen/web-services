const supertest = require("supertest");
const createServer = require("../src/createServer");
const { tables, getKnex } = require("../src/data");

const data = {
  groepen: [
    {
      groep_id: 3,
      groep_naam: "Waterschildpadden",
      beschrijving: "Watergewenning, ontdekken diep",
      aantal_lesgevers: 1,
    },
    {
      groep_id: 7,
      groep_naam: "Dolfijnen",
      beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
      aantal_lesgevers: 1,
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
    {
      lesvoorbereiding_id: 2,
      lesvoorbereiding_naam: "Jasmijn de Dolfijn maakt een toets",
      lesvoorbereiding_type: "Tussentijds Brevet",
      link_to_PDF: "https://www.move-united.be/",
      feedback: "Dit is een test 2",
      les_id: 7,
      groep_id: 7,
    },
    {
      lesvoorbereiding_id: 3,
      lesvoorbereiding_naam: "Walter de Walrus gaat naar de speeltuin",
      lesvoorbereiding_type: "Speelles",
      link_to_PDF: "https://chamilo.hogent.be/",
      feedback: "Dit is een test 3",
      les_id: 15,
      groep_id: 3,
    },
  ],
};

const dataToDelete = {
  groepen: [3, 7],
  lessenreeksen: [1, 2, 3],
  lessen: [1, 7, 15],
  lesvoorbereidingen: [1, 2, 3],
};

describe("Lesvoorbereidingen", () => {
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

  const URL = "/api/lesvoorbereidingen";

  // GET /api/lesvoorbereidingen

  describe("GET /api/lesvoorbereidingen", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesvoorbereiding).insert(data.lesvoorbereidingen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", dataToDelete.lesvoorbereidingen)
        .del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return all lesvoorbereidingen", async () => {
      const response = await request.get(URL);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.items[0]).toEqual({
        lesvoorbereiding_id: 1,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar school",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les: {
          les_id: 1,
        },
        groep: {
          groep_id: 3,
          groep_naam: "Waterschildpadden",
          beschrijving: "Watergewenning, ontdekken diep",
          aantal_lesgevers: 1,
        },
      });

      expect(response.body.items[1]).toEqual({
        lesvoorbereiding_id: 2,
        lesvoorbereiding_naam: "Jasmijn de Dolfijn maakt een toets",
        lesvoorbereiding_type: "Tussentijds Brevet",
        link_to_PDF: "https://www.move-united.be/",
        feedback: "Dit is een test 2",
        les: {
          les_id: 7,
        },
        groep: {
          groep_id: 7,
          groep_naam: "Dolfijnen",
          beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
          aantal_lesgevers: 1,
        },
      });

      expect(response.body.items[2]).toEqual({
        lesvoorbereiding_id: 3,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar de speeltuin",
        lesvoorbereiding_type: "Speelles",
        link_to_PDF: "https://chamilo.hogent.be/",
        feedback: "Dit is een test 3",
        les: {
          les_id: 15,
        },
        groep: {
          groep_id: 3,
          groep_naam: "Waterschildpadden",
          beschrijving: "Watergewenning, ontdekken diep",
          aantal_lesgevers: 1,
        },
      });
    });
  });

  // GET /api/lesvoorbereidingen/:id

  describe("GET /api/lesvoorbereidingen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesvoorbereiding).insert(data.lesvoorbereidingen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", dataToDelete.lesvoorbereidingen)
        .del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the requested lesvoorbereiding", async () => {
      const response = await request.get(`${URL}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        lesvoorbereiding_id: 1,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar school",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les: {
          les_id: 1,
        },
        groep: {
          groep_id: 3,
          groep_naam: "Waterschildpadden",
          beschrijving: "Watergewenning, ontdekken diep",
          aantal_lesgevers: 1,
        },
      });
    });
  });

  // PUT /api/lesvoorbereidingen/:id

  describe("PUT /api/lesvoorbereidingen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesvoorbereiding).insert(data.lesvoorbereidingen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", dataToDelete.lesvoorbereidingen)
        .del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the updated lesvoorbereiding", async () => {
      const response = await request.put(`${URL}/1`).send({
        lesvoorbereiding_naam: "Walter de Walrus gaat naar de speeltuin 2.0",
        lesvoorbereiding_type: "Speelles 2.0",
        link_to_PDF: "https://chamilo.hogent.be/",
        feedback: "Dit is een test 3.0",
        les_id: 15,
        groep_id: 7,
      });

      expect(response.status).toBe(200);
      expect(response.body.lesvoorbereiding_id).toBeTruthy();
      expect(response.body.lesvoorbereiding_naam).toBe(
        "Walter de Walrus gaat naar de speeltuin 2.0"
      );
      expect(response.body.lesvoorbereiding_type).toBe("Speelles 2.0");
      expect(response.body.link_to_PDF).toBe("https://chamilo.hogent.be/");
      expect(response.body.feedback).toBe("Dit is een test 3.0");
      expect(response.body.les).toEqual({
        les_id: 15,
      });
      expect(response.body.groep).toEqual({
        groep_id: 7,
        groep_naam: "Dolfijnen",
        beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
        aantal_lesgevers: 1,
      });
    });
  });

  // POST /api/lesvoorbereidingen

  describe("POST /api/lesvoorbereidingen", () => {
    const lesvoorBereidingenToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", lesvoorBereidingenToDelete)
        .del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 201 and return the created lesvoorbereiding", async () => {
      const response = await request.post(URL).send({
        lesvoorbereiding_naam: "Jasmijn de Dolfijn onderzoekt de grotten",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://chamilo.hogent.be/",
        feedback: "Dit is de les vanuit de testklasse",
        les_id: 1,
        groep_id: 7,
      });
      expect(response.status).toBe(201);
      expect(response.body.lesvoorbereiding_id).toBeTruthy();
      expect(response.body.lesvoorbereiding_naam).toBe(
        "Jasmijn de Dolfijn onderzoekt de grotten"
      );
      expect(response.body.lesvoorbereiding_type).toBe("Gewone Les");
      expect(response.body.link_to_PDF).toBe("https://chamilo.hogent.be/");
      expect(response.body.feedback).toBe("Dit is de les vanuit de testklasse");
      expect(response.body.les).toEqual({
        les_id: 1,
      });
      expect(response.body.groep).toEqual({
        groep_id: 7,
        groep_naam: "Dolfijnen",
        beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
        aantal_lesgevers: 1,
      });

      lesvoorBereidingenToDelete.push(response.body.lesvoorbereiding_id);
    });
  });

  // DELETE /api/lesvoorbereidingen/:id

  describe("DELETE /api/lesvoorbereidingen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesvoorbereiding).insert(data.lesvoorbereidingen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesvoorbereiding)
        .whereIn("lesvoorbereiding_id", dataToDelete.lesvoorbereidingen)
        .del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
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
