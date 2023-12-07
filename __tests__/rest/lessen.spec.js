const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

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

describe("Lessen", () => {
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
      const response = await request.get(URL).set("Authorization", authHeader);

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
      const response = await request
        .get(`${URL}/1`)
        .set("Authorization", authHeader);

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

    test("should 400 with invalid les_id", async () => {
      const response = await request
        .get(`${URL}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when requesting not existing les", async () => {
      const response = await request
        .get(`${URL}/10`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details.id).toBe(10);
    });

    testAuthHeader(() => request.get(`${URL}/1`));
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
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 400 with invalid les_id", async () => {
      const response = await request
        .put(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2033, 10, 1, 0),
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when updating not existing les", async () => {
      const response = await request
        .put(`${URL}/10`)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2033, 10, 1, 0),
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details.id).toBe(10);
    });

    test("should 404 when lessenreeks does not exist", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2033, 10, 1, 0),
          lessenreeks_id: 10,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 10!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 when missing datum", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("datum");
    });

    test("should 400 when missing lessenreeks_id", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2033, 10, 1, 0),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lessenreeks_id");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .put(`${URL}/1`)
        .set("Authorization", authHeader)
        .send({
          datum: new Date(2033, 10, 1, 0),
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.put(`${URL}/1`));
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
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
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

    test("should 404 when lessenreeks does not exist", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2043, 10, 1, 0),
          lessenreeks_id: 10,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen lessenreeks met id 10!",
      });
      expect(response.body.stack).toBeTruthy();
    });

    test("should 400 when missing datum", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("datum");
    });

    test("should 400 when missing lessenreeks_id", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", adminAuthHeader)
        .send({
          datum: new Date(2043, 10, 1, 0),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("lessenreeks_id");
    });

    test("should 403 when not admin", async () => {
      const response = await request
        .post(URL)
        .set("Authorization", authHeader)
        .send({
          datum: new Date(2043, 10, 1, 0),
          lessenreeks_id: 2,
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
    });

    testAuthHeader(() => request.post(URL));
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
      const response = await request
        .delete(`${URL}/1`)
        .set("Authorization", adminAuthHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    test("should 400 with invalid les_id", async () => {
      const response = await request
        .delete(`${URL}/invalid`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });

    test("should 404 when deleting not existing les", async () => {
      const response = await request
        .delete(`${URL}/10`)
        .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen les met id 10!",
      });
      expect(response.body.stack).toBeTruthy();
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
