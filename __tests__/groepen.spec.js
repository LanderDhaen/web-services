const supertest = require("supertest");
const createServer = require("../src/createServer");
const { getKnex } = require("../src/data");

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
    it("should 200 and return all groepen", async () => {
      const response = await request.get(URL);
      expect(response.status).toBe(200);
    });
  });
});
