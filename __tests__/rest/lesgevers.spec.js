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
    {
      lesgever_id: 4,
      lesgever_naam: "Evert Walravens",
      geboortedatum: new Date(2001, 3, 30, 0),
      type: "Verantwoordelijke",
      aanwezigheidspercentage: 0,
      diploma: "Leerkracht LO",
      imageURL: "",
      email: "evert.walravens@move-united.be",
      GSM: "0490000000",
      groep_id: 7,
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify(["lesgever"]),
    },
  ],
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
    {
      groep_id: 4,
      groep_naam: "Otters",
      beschrijving: "Eerste stappen leren zwemmen",
      aantal_lesgevers: 0,
    },
    {
      groep_id: 5,
      groep_naam: "Walrussen",
      beschrijving: "Benen schoolslag, rug stretch 3",
      aantal_lesgevers: 0,
    },
    {
      groep_id: 6,
      groep_naam: "Orkas",
      beschrijving: "Schoolslag, crawl stretch 3",
      aantal_lesgevers: 0,
    },
    {
      groep_id: 7,
      groep_naam: "Dolfijnen",
      beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
      aantal_lesgevers: 1,
    },
    {
      groep_id: 8,
      groep_naam: "Losse lesgevers",
      beschrijving: "Visie-cel, Coördinatoren, Stuurgroep",
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
      datum: new Date("2023-09-01"),
      lessenreeks_id: 1,
    },
    {
      les_id: 2,
      datum: new Date("2023-09-08"),
      lessenreeks_id: 1,
    },
  ],
  schemas: [
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
      les_id: 2,
      groep_id: 7,
      lesgever_id: 1,
    },
  ],
};

const dataToDelete = {
  lesgevers: [3, 4],
  groepen: [1, 2, 3, 4, 5, 6, 7, 8],
  lessenreeksen: [1],
  lessen: [1, 2],
  schemas: [1, 2, 3],
};

describe("Lesgevers", () => {
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

  const URL = "/api/lesgevers";

  // GET /api/lesgevers

  describe("GET /api/lesgevers", () => {
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

    test("should 200 and return all lesgevers", async () => {
      const response = await request
        .get(URL)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(4);

      expect(response.body.items[0]).toEqual({
        lesgever_id: 1,
        lesgever_naam: "Test User",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Lesvrij",
        aanwezigheidspercentage: 100,
        diploma: "Redder",
        imageURL: "",
        email: "test.user@gmail.com",
        GSM: "0491882278",
        groep: {
          groep_id: 9,
          groep_naam: "Redders",
          beschrijving: "Redders",
          aantal_lesgevers: 0,
        },
        roles: ["lesgever"],
      });

      expect(response.body.items[1]).toEqual({
        lesgever_id: 2,
        lesgever_naam: "Admin User",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Verantwoordelijke",
        aanwezigheidspercentage: 100,
        diploma: "Animator",
        imageURL: "",
        email: "test.admin@gmail.com",
        GSM: "0491228878",
        groep: {
          groep_id: 9,
          groep_naam: "Redders",
          beschrijving: "Redders",
          aantal_lesgevers: 0,
        },
        roles: ["admin", "lesgever"],
      });

      expect(response.body.items[2]).toEqual({
        lesgever_id: 3,
        lesgever_naam: "Hannah Van den Steen",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
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
        roles: ["admin", "lesgever"],
      });

      expect(response.body.items[3]).toEqual({
        lesgever_id: 4,
        lesgever_naam: "Evert Walravens",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Verantwoordelijke",
        aanwezigheidspercentage: 0,
        diploma: "Leerkracht LO",
        imageURL: "",
        email: "evert.walravens@move-united.be",
        GSM: "0490000000",
        groep: {
          groep_id: 7,
          groep_naam: "Dolfijnen",
          beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
          aantal_lesgevers: 1,
        },
        roles: ["lesgever"],
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
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this part of the application",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.get(URL));
  });

  // GET /api/lesgevers/:id

  describe("GET /api/lesgevers/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should 200 and return the correct lesgever", async () => {
      const response = await request
        .get(`${URL}/1`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        lesgever_id: 1,
        lesgever_naam: "Test User",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Lesvrij",
        aanwezigheidspercentage: 100,
        diploma: "Redder",
        imageURL: "",
        email: "test.user@gmail.com",
        GSM: "0491882278",
        groep: {
          groep_id: 9,
          groep_naam: "Redders",
          beschrijving: "Redders",
          aantal_lesgevers: 0,
        },
        roles: ["lesgever"],
      });
    });

    test("should 404 when requesting not existing lesgever", async () => {
      const response = await request
        .get(`${URL}/6`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 6!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lesgever_id", async () => {
      const response = await request
        .get(`${URL}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 403 when not admin and requesting different user", async () => {
      const response = await request
        .get(`${URL}/3`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this user's information",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.get(`${URL}/1`));
  });

  // GET /api/lesgevers/:id/lesgeverschemas

  describe("GET /api/:id/lesgeverschemas", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers);
      await knex(tables.lessenreeks).insert(data.lessenreeksen);
      await knex(tables.les).insert(data.lessen);
      await knex(tables.lesgeverschema).insert(data.schemas);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgeverschema)
        .whereIn("les_lesgever_id", dataToDelete.schemas)
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

    test("should 200 and return the correct schemas for the requested lesgever", async () => {
      const response = await request
        .get(`${URL}/1/lesgeverschemas`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          les_lesgever_id: 1,
          les_id: 1,
          groep_id: 3,
          lesgever_id: 1,
        },
        {
          les_lesgever_id: 3,
          les_id: 2,
          groep_id: 7,
          lesgever_id: 1,
        },
      ]);
    });

    test("should 404 when requesting not existing lesgever", async () => {
      const response = await request
        .get(`${URL}/6/lesgeverschemas`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 6!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lesgever_id", async () => {
      const response = await request
        .get(`${URL}/invalid/lesgeverschemas`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting the schemas of a lesgever with no schemas", async () => {
      const response = await request
        .get(`${URL}/3/lesgeverschemas`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaan geen lesgeverschemas voor lesgever_id 3!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 403 when not admin and requesting different user", async () => {
      const response = await request
        .get(`${URL}/3/lesgeverschemas`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this user's information",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.get(`${URL}/1/lesgeverschemas`));
  });

  // PUT /api/lesgevers/:id

  describe("PUT /api/lesgevers/:id", () => {
    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgever)
        .whereIn("lesgever_id", dataToDelete.lesgevers)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test
    test("should 200 and return the updated lesgever", async () => {
      const response = await request
        .put(`${URL}/3`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.status).toBe(200);
      expect(response.body.lesgever_id).toBeTruthy();
      expect(response.body.lesgever_naam).toBe("Lander Dhaen 2.0");
      expect(response.body.geboortedatum).toBe("2001-03-30T00:00:00.000Z");
      expect(response.body.type).toBe("Verantwoordelijke");
      expect(response.body.aanwezigheidspercentage).toBe(80);
      expect(response.body.diploma).toBe("Animator");
      expect(response.body.imageURL).toBe("test");
      expect(response.body.email).toBe("lander.dhaen@gmail.com");
      expect(response.body.GSM).toBe("0000000000");
      expect(response.body.groep).toEqual({
        groep_id: 8,
        groep_naam: "Losse lesgevers",
        beschrijving: "Visie-cel, Coördinatoren, Stuurgroep",
        aantal_lesgevers: 1,
      });
      expect(JSON.parse(response.body.roles)).toEqual(["admin", "lesgever"]);
    });

    test("should 404 with not existing lesgever", async () => {
      const response = await request
        .put(`${URL}/123`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 123!",
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lesgever_id", async () => {
      const response = await request
        .put(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when groep does not exist", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 100,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen groep met id 100!",
        details: {
          id: 100,
        },
      });

      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 when missing lesgever_naam", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lesgever_naam");
    });

    test("should 400 when missing geboortedatum", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("geboortedatum");
    });

    test("should 400 when missing type", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("type");
    });

    test("should 400 when missing aanwezigheidspercentage", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty(
        "aanwezigheidspercentage"
      );
    });

    test("should 400 when missing diploma", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("diploma");
    });

    test("should 400 when missing imageURL", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("imageURL");
    });

    test("should 400 when missing email", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("email");
    });

    test("should 400 when missing GSM", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          groep_id: 8,
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("GSM");
    });

    test("should 400 when missing groep_id", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          password: "12345678",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_id");
    });

    test("should 400 when missing password", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    });

    test("should 400 when missing roles", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("roles");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .put(`${URL}/2`)
        .set("Authorization", authHeader)
        .send({
          lesgever_naam: "Lander Dhaen 2.0",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Verantwoordelijke",
          aanwezigheidspercentage: 80,
          diploma: "Animator",
          imageURL: "test",
          email: "lander.dhaen@gmail.com",
          GSM: "0000000000",
          groep_id: 8,
          password_hash:
            "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
          roles: JSON.stringify(["admin", "lesgever"]),
        });

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this part of the application",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${URL}/1`));
  });

  // POST /api/lesgevers

  describe("POST /api/lesgevers", () => {
    const lesgeversToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
      await knex(tables.lesgever).insert(data.lesgevers[0]);
    });

    // Testdata verwijderen uit database

    afterAll(async () => {
      await knex(tables.lesgever)
        .whereIn("lesgever_id", lesgeversToDelete)
        .del();
      await knex(tables.groep).whereIn("groep_id", dataToDelete.groepen).del();
    });

    // Test

    test("should be 201 and return the created lesgever", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.status).toBe(201);
      expect(response.body.lesgever_id).toBeTruthy();
      expect(response.body.lesgever_naam).toBe("Fix it Felix");
      expect(response.body.geboortedatum).toBe("2001-03-30T00:00:00.000Z");
      expect(response.body.type).toBe("Reserve Lesgever");
      expect(response.body.aanwezigheidspercentage).toBe(10);
      expect(response.body.diploma).toBe("Geen");
      expect(response.body.imageURL).toBe("test");
      expect(response.body.email).toBe("fixitfelix@move-united.be");
      expect(response.body.GSM).toBe("0491111111");
      expect(response.body.groep).toEqual({
        groep_id: 1,
        groep_naam: "Eendjes",
        beschrijving: "Startgroep, met ouders",
        aantal_lesgevers: 0,
      });
      expect(response.body.roles).toEqual(["user"]);

      lesgeversToDelete.push(response.body.lesgever_id);
    });

    test("should 400 when groep does not exist", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 100,
          password: "12345678",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen groep met id 100!",
        details: {
          id: 100,
        },
      });
    });

    test("should 400 when duplicate email", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "lander.dhaen@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: "VALIDATION_FAILED",
        message: "Er bestaat al een lesgever met dit emailadres",
      });
      expect(response.body.stack).toBeTruthy();

      lesgeversToDelete.push(3);
    });

    test("should 400 when duplicate email", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix2.0@move-united.be",
          GSM: "0499999999",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: "VALIDATION_FAILED",
        message: "Er bestaat al een lesgever met dit GSM-nummer",
      });
      expect(response.body.stack).toBeTruthy();

      lesgeversToDelete.push(3);
    });

    test("should 400 when missing lesgever_naam", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lesgever_naam");
    });

    test("should 400 when missing geboortedatum", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("geboortedatum");
    });

    test("should 400 when missing type", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("type");
    });

    test("should 400 when missing aanwezigheidspercentage", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty(
        "aanwezigheidspercentage"
      );
    });

    test("should 400 when missing diploma", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("diploma");
    });

    test("should 400 when missing imageURL", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("imageURL");
    });

    test("should 400 when missing email", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("email");
    });

    test("should 400 when missing GSM", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("GSM");
    });

    test("should 400 when missing groep_id", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          password: "12345678",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("groep_id");
    });

    test("should 400 when missing password", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", authHeader)
        .send({
          lesgever_naam: "Fix it Felix",
          geboortedatum: "2001-03-30T00:00:00.000Z",
          type: "Reserve Lesgever",
          aanwezigheidspercentage: 10,
          diploma: "Geen",
          imageURL: "test",
          email: "fixitfelix@move-united.be",
          GSM: "0491111111",
          groep_id: 1,
          password: "12345678",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: "FORBIDDEN",
        message: "You are not allowed to view this part of the application",
      });

      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.post(URL));
  });

  // DELETE /api/lesgevers/:id

  describe("DELETE /api/lesgevers/:id", () => {
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

    test("should be 204 and return nothing", async () => {
      const response = await request
        .delete(`${URL}/3`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    test("should 400 with invalid lesgever_id", async () => {
      const response = await request
        .get(`${URL}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 with not existing lesgever", async () => {
      const response = await request
        .delete(`${URL}/123`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lesgever met id 123!",
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .delete(`${URL}/3`)
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
