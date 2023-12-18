const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

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
      groep_id: 1,
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify(["admin, user"]),
    },
  ],

  lesvoorbereidingen: [
    {
      lesvoorbereiding_id: 1,
      lesvoorbereiding_naam: "Ellie het Eendje gaat naar school",
      lesvoorbereiding_type: "Gewone Les",
      link_to_PDF: "https://www.google.com",
      feedback: "Dit is een test",
      les_id: 1,
      groep_id: 1,
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
  let request;
  let knex;
  let authHeader;
  let adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
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
      const response = await request
        .get(URL)
        .set("Authorization", adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(4);

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

      expect(response.body.items[3]).toEqual({
        groep_id: 9,
        groep_naam: "Redders",
        beschrijving: "Redders",
        aantal_lesgevers: 0,
      });
    });

    test("should 400 when given an argument", async () => {
      const response = await request
        .get(`${URL}?invalid=true`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    test("should 403 when not admin", async () => {
      const response = await request.get(URL).set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.get(URL));
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
      const response = await request
        .get(`${URL}/1`)
        .set("Authorization", adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        groep_id: 1,
        groep_naam: "Eendjes",
        beschrijving: "Startgroep, met ouders",
        aantal_lesgevers: 0,
      });
    });

    test("should 400 with invalid groep_id", async () => {
      const response = await request
        .get(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting not existing groep", async () => {
      const response = await request
        .get(`${URL}/100`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .get(`${URL}/1`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.get(`${URL}/1`));
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
      const response = await request
        .get(`${URL}/1/lesgevers`)
        .set("Authorization", adminAuthHeader);

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
          groep_id: 1,
          groep_naam: "Eendjes",
          beschrijving: "Startgroep, met ouders",
          aantal_lesgevers: 0,
        },
        roles: ["admin, user"],
      });
    });

    test("should 400 with invalid groep_id", async () => {
      const response = await request
        .get(`${URL}/invalid/lesgevers`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting not existing groep", async () => {
      const response = await request
        .get(`${URL}/100/lesgevers`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
    });

    test("should 404 when requesting lesgevers of groep without lesgevers", async () => {
      const response = await request
        .get(`${URL}/2/lesgevers`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaan geen lesgevers voor groep met groep_id 2!",
      });
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .get(`${URL}/1/lesgevers`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.get(`${URL}/1/lesgevers`));
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
      const response = await request
        .get(`${URL}/1/lesvoorbereidingen`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual({
        lesvoorbereiding_id: 1,
        lesvoorbereiding_naam: "Ellie het Eendje gaat naar school",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les: {
          les_id: 1,
        },
        groep: {
          groep_id: 1,
          groep_naam: "Eendjes",
          beschrijving: "Startgroep, met ouders",
          aantal_lesgevers: 0,
        },
      });
    });

    test("should 400 with invalid groep_id", async () => {
      const response = await request
        .get(`${URL}/invalid/lesvoorbereidingen`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting not existing groep", async () => {
      const response = await request
        .get(`${URL}/100/lesvoorbereidingen`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
    });

    test("should 404 when requesting lesvoorbereidingen of groep without lesvoorbereidingen", async () => {
      const response = await request
        .get(`${URL}/2/lesvoorbereidingen`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message:
          "Er bestaan geen lesvoorbereidingen voor groep met groep_id 2!",
      });
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .get(`${URL}/1/lesvoorbereidingen`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.get(`${URL}/1/lesvoorbereidingen`));
  });

  // PUT /api/groepen/:id

  describe("PUT /api/groepen/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the updated groep", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 400 with invalid groep_id", async () => {
      const response = await request
        .put(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Eendjes 2.0",
          beschrijving: "Startgroep, met ouders 2.0",
          aantal_lesgevers: 8,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting not existing groep", async () => {
      const response = await request
        .put(`${URL}/100`)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Eendjes 2.0",
          beschrijving: "Startgroep, met ouders 2.0",
          aantal_lesgevers: 8,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
    });

    test("should 400 when missing groep_naam", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          beschrijving: "Startgroep, met ouders 2.0",
          aantal_lesgevers: 8,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_naam");
    });

    test("should 400 when missing beschrijving", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Eendjes 2.0",
          aantal_lesgevers: 8,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("beschrijving");
    });

    test("should 400 when missing aantal_lesgevers", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Eendjes 2.0",
          beschrijving: "Startgroep, met ouders 2.0",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("aantal_lesgevers");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", authHeader)
        .send({
          groep_naam: "Eendjes 2.0",
          beschrijving: "Startgroep, met ouders 2.0",
          aantal_lesgevers: 8,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.put(`${URL}/1`));
  });

  // POST /api/groepen

  describe("POST /api/groepen", () => {
    const groepenToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.groep).whereIn("groep_id", groepenToDelete).del();
    });

    // Test

    test("should 201 and return the created groep", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 400 when duplicate groep_naam", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Eendjes",
          beschrijving: "Competitiegroep",
          aantal_lesgevers: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: "VALIDATION_FAILED",
        message: "Groep met deze naam bestaat al",
      });
      expect(response.body.stack).toBeTruthy();

      groepenToDelete.push(1);
    });

    test("should 400 when missing groep_naam", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          beschrijving: "Competitiegroep",
          aantal_lesgevers: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_naam");
    });

    test("should 400 when missing beschrijving", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Haaien",
          aantal_lesgevers: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("beschrijving");
    });

    test("should 400 when missing aantal_lesgevers", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_naam: "Haaien",
          beschrijving: "Competitiegroep",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("aantal_lesgevers");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", authHeader)
        .send({
          groep_naam: "Haaien",
          beschrijving: "Competitiegroep",
          aantal_lesgevers: 5,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.post(URL));
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
      const response = await request
        .delete(`${URL}/1`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    test("should 404 when deleting not existing groep", async () => {
      const response = await request
        .delete(`${URL}/100`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen groep met id 100!",
      });
    });

    test("should 400 with invalid groep_id", async () => {
      const response = await request
        .delete(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .delete(`${URL}/1`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this part of the application",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${URL}/1`));
  });
});
