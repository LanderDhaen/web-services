const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

const data = {
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
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify(["admin", "lesgever"]),
    },
  ],
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
  ],

  lessen: [
    {
      les_id: 1,
      datum: new Date(2023, 9, 1, 0),
      lessenreeks_id: 1,
    },
  ],
  lesgeverschemas: [
    {
      les_lesgever_id: 1,
      les_id: 1,
      groep_id: 3,
      lesgever_id: 1,
    },
    {
      les_lesgever_id: 2,
      les_id: 1,
      groep_id: 7,
      lesgever_id: 2,
    },
    {
      les_lesgever_id: 3,
      les_id: 1,
      groep_id: 7,
      lesgever_id: 3,
    },
  ],
};

const dataToDelete = {
  lesgevers: [3],
  groepen: [3, 7],
  lessenreeksen: [1],
  lessen: [1],
  lesgeverschemas: [1, 2, 3],
};

describe("Lesgeverschemas", () => {
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

  const URL = "/api/lesgeverschemas";

  // GET /api/lesgeverschemas

  describe("GET /api/lesgeverschemas", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesgeverschema).insert(data.lesgeverschemas);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgeverschema)
        .whereIn("les_lesgever_id", dataToDelete.lesgeverschemas)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
    });

    // Test

    test("should 200 and return all lesgeverschemas", async () => {
      const response = await request
        .get(URL)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
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
        groepen: [
          {
            groep_id_schema: 3,
            lesgevers: [
              {
                les_lesgever_id: 1,
                lesgever_id: 1,
                lesgever_naam: "Test User",
                geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
                type: "Lesvrij",
                aanwezigheidspercentage: 100,
                diploma: "Redder",
                imageURL: "",
                email: "test.user@gmail.com",
                GSM: "0491882278",
                groep_id: 9,
              },
            ],
          },
          {
            groep_id_schema: 7,
            lesgevers: [
              {
                les_lesgever_id: 2,
                lesgever_id: 2,
                lesgever_naam: "Admin User",
                geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
                type: "Verantwoordelijke",
                aanwezigheidspercentage: 100,
                diploma: "Animator",
                imageURL: "",
                email: "test.admin@gmail.com",
                GSM: "0491228878",
                groep_id: 9,
              },
              {
                les_lesgever_id: 3,
                lesgever_id: 3,
                lesgever_naam: "Hannah Van den Steen",
                geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
                type: "Vaste Lesgever",
                aanwezigheidspercentage: 100,
                diploma: "Leerkracht LO",
                imageURL: "",
                email: "lander.dhaen@move-united.be",
                GSM: "0499999999",
                groep_id: 3,
              },
            ],
          },
        ],
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

  // PUT /api/lesgeverschemas/:id

  describe("PUT /api/lesgeverschemas/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesgeverschema).insert(data.lesgeverschemas[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgeverschema).del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
    });

    // Test

    test("should 200 and return updated lesgeverschema", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 2,
        });

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
        groepen: [
          {
            groep_id_schema: 7,
            lesgevers: [
              {
                les_lesgever_id: 1,
                lesgever_id: 2,
                lesgever_naam: "Admin User",
                geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
                type: "Verantwoordelijke",
                aanwezigheidspercentage: 100,
                diploma: "Animator",
                imageURL: "",
                email: "test.admin@gmail.com",
                GSM: "0491228878",
                groep_id: 9,
              },
            ],
          },
        ],
      });
    });

    test("should 400 with invalid les_lesgever_id", async () => {
      const response = await request
        .put(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when les does not exist", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1000,
          groep_id: 7,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen les met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 404 when groep does not exist", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 1000,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen groep met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 404 when lesgever does not exist", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 1000,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 400 when missing les_id", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_id: 7,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("les_id");
    });

    test("should 400 when missing groep_id", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_id");
    });

    test("should 400 when missing lesgever_id", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lesgever_id");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", authHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 2,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.put(`${URL}/1`));
  });

  // POST /api/lesgeverschemas

  describe("POST /api/lesgeverschemas", () => {
    const schemaToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
      await knex(tables.lesgeverschema)
        .whereIn("les_lesgever_id", schemaToDelete)
        .del();
    });

    // Test

    test("should 201 and return created lesgeverschema", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 3,
        });

      expect(response.status).toBe(201);
      expect(
        response.body.groepen[0].lesgevers[0].les_lesgever_id
      ).toBeTruthy();
      expect(response.body.les_id).toBe(1);
      expect(response.body.groepen[0].groep_id_schema).toBe(7);
      expect(response.body.groepen[0].lesgevers[0].lesgever_id).toBe(3);

      schemaToDelete.push(
        response.body.groepen[0].lesgevers[0].les_lesgever_id
      );
    });

    test("should 400 when missing les_id", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          groep_id: 7,
          lesgever_id: 3,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("les_id");
    });

    test("should 400 when missing groep_id", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          lesgever_id: 3,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_id");
    });

    test("should 400 when missing lesgever_id", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lesgever_id");
    });

    test("should 404 when les does not exist", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1000,
          groep_id: 7,
          lesgever_id: 3,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen les met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 404 when groep does not exist", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 1000,
          lesgever_id: 3,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen groep met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 404 when lesgever does not exist", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 1000,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 1000!",
        details: {
          id: 1000,
        },
      });
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", authHeader)
        .send({
          les_id: 1,
          groep_id: 7,
          lesgever_id: 3,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.post(URL));
  });

  // DELETE /api/lesgeverschemas/:id

  describe("DELETE /api/lesgeverschemas/:id", () => {
    const schemaToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesgeverschema).insert(data.lesgeverschemas[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgeverschema)
        .whereIn("les_lesgever_id", schemaToDelete)
        .del();
      await knex(tables.les).whereIn("les_id", dataToDelete.lessen).del();
      await knex(tables.lessenreeks)
        .whereIn("lessenreeks_id", dataToDelete.lessenreeksen)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
    });

    // Test

    test("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${URL}/1`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    test("should 400 with invalid les_lesgever_id", async () => {
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
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.delete(`${URL}/1`));
  });
});
