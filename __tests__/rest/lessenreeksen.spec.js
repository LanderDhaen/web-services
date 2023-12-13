const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

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

    // Test

    test("should 200 and return all lessenreeksen", async () => {
      const response = await request.get(URL).set("Authorization", authHeader);

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

    test("should 400 when given an argument", async () => {
      const response = await request
        .get(`${URL}?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });

    testAuthHeader(() => request.get(URL));
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
      const response = await request
        .get(`${URL}/1`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        lessenreeks_id: 1,
        jaargang: "2023-2024",
        nummer: 1,
        startdatum: new Date(2023, 9, 1, 0).toJSON(),
        einddatum: new Date(2023, 12, 30, 0).toJSON(),
      });
    });

    test("should 404 when requesting not existing lessenreeks", async () => {
      const response = await request
        .get(`${URL}/600`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 600!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lessenreeks_id", async () => {
      const response = await request
        .get(`${URL}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    testAuthHeader(() => request.get(`${URL}/1`));
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
      const response = await request
        .get(`${URL}/1/lessen`)
        .set("Authorization", authHeader);

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

    test("should 404 when requesting lessen of not existing lessenreeks", async () => {
      const response = await request
        .get(`${URL}/6/lessen`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 6!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lessenreeks_id", async () => {
      const response = await request
        .get(`${URL}/invalid/lessen`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    testAuthHeader(() => request.get(`${URL}/1/lessen`));
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
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 404 when updating not existing lessenreeks", async () => {
      const response = await request
        .put(`${URL}/6`)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2030-2031",
          nummer: 1,
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 6!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lessenreeks_id", async () => {
      const response = await request
        .put(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2030-2031",
          nummer: 1,
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 400 when missing jaargang", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          nummer: 1,
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("jaargang");
    });

    test("should 400 when missing nummer", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2030-2031",
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("nummer");
    });

    test("should 400 when missing startdatum", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2030-2031",
          nummer: 1,
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("startdatum");
    });

    test("should 400 when missing einddatum", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2030-2031",
          nummer: 1,
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("einddatum");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", authHeader)
        .send({
          jaargang: "2030-2031",
          nummer: 1,
          startdatum: new Date(2030, 9, 1, 0).toJSON(),
          einddatum: new Date(2030, 12, 30, 0).toJSON(),
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
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 400 when missing jaargang", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          nummer: 1,
          startdatum: new Date(2040, 9, 1, 0).toJSON(),
          einddatum: new Date(2040, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("jaargang");
    });

    test("should 400 when missing nummer", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2040-2041",
          startdatum: new Date(2040, 9, 1, 0).toJSON(),
          einddatum: new Date(2040, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("nummer");
    });

    test("should 400 when missing startdatum", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2040-2041",
          nummer: 1,
          einddatum: new Date(2040, 12, 30, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("startdatum");
    });

    test("should 400 when missing einddatum", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          jaargang: "2040-2041",
          nummer: 1,
          startdatum: new Date(2040, 9, 1, 0).toJSON(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("einddatum");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", authHeader)
        .send({
          jaargang: "2040-2041",
          nummer: 1,
          startdatum: new Date(2040, 9, 1, 0).toJSON(),
          einddatum: new Date(2040, 12, 30, 0).toJSON(),
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

    test("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${URL}/1`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    test("should 404 when deleting not existing lessenreeks", async () => {
      const response = await request
        .delete(`${URL}/6`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 6!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 with invalid lessenreeks_id", async () => {
      const response = await request
        .delete(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
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
