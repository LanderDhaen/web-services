const supertest = require("supertest"); // 👈 4
const createServer = require("../src/createServer"); // 👈 3
const { getKnex } = require("../src/data"); // 👈 4

// 👇 6
const login = async (supertest) => {
  // 👇 7
  const response = await supertest.post("/api/lesgevers/login").send({
    email: "test.user@gmail.com",
    password: "12345678",
  });

  // 👇 8
  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`; // 👈 9
};

const loginAdmin = async (supertest) => {
  const response = await supertest.post("/api/lesgevers/login").send({
    email: "test.admin@gmail.com",
    password: "12345678",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};

// 👇 1
const withServer = (setter) => {
  // 👈 4
  let server; // 👈 2

  beforeAll(async () => {
    server = await createServer(); // 👈 3

    // 👇 4
    setter({
      knex: getKnex(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop(); // 👈 5
  });
};

module.exports = {
  login,
  loginAdmin,
  withServer,
}; // 👈 1 en 6
