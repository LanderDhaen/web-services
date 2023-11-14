const supertest = require("supertest");
const createServer = require("../src/createServer");
const { getKnex } = require("../src/data");

describe("Lesgevers", () => {
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

  const URL = "/api/lesgevers";

  describe("GET /api/lesgevers", () => {
    it("should 200 and return all lesgevers", async () => {
      const response = await request.get(URL);
      expect(response.status).toBe(200);
    });
  });
});
