const supertest = require("supertest");
const createServer = require("../src/createServer");
const { tables, getKnex } = require("../src/data");

const data = {
  lesgevers: [
    {
      lesgever_id: 1,
      lesgever_naam: "Lander Dhaen",
      geboortedatum: new Date(2001, 3, 30, 0, 0),
      type: "Lesvrij",
      aanwezigheidspercentage: 100,
      diploma: "Redder",
      imageURL: "",
      email: "lander.dhaen@gmail.com",
      GSM: "0491882278",
      groep_id: 8,
    },
    {
      lesgever_id: 2,
      lesgever_naam: "Robbe De Back-End",
      geboortedatum: new Date(2001, 3, 30, 0),
      type: "Verantwoordelijke",
      aanwezigheidspercentage: 95,
      diploma: "Initiator",
      imageURL: "",
      email: "robbe.debackend@move-united.be",
      GSM: "0477777777",
      groep_id: 7,
    },
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
    {
      groep_id: 9,
      groep_naam: "Redders",
      beschrijving: "Redders",
      aantal_lesgevers: 0,
    },
  ],
};

const dataToDelete = {
  lesgevers: [1, 2, 3, 4],
  groepen: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

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
      const response = await request.get(URL);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(4);

      expect(response.body.items[0]).toEqual({
        lesgever_id: 1,
        lesgever_naam: "Lander Dhaen",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Lesvrij",
        aanwezigheidspercentage: 100,
        diploma: "Redder",
        imageURL: "",
        email: "lander.dhaen@gmail.com",
        GSM: "0491882278",
        groep: {
          groep_id: 8,
          groep_naam: "Losse lesgevers",
          beschrijving: "Visie-cel, Coördinatoren, Stuurgroep",
          aantal_lesgevers: 1,
        },
      });

      expect(response.body.items[1]).toEqual({
        lesgever_id: 2,
        lesgever_naam: "Robbe De Back-End",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Verantwoordelijke",
        aanwezigheidspercentage: 95,
        diploma: "Initiator",
        imageURL: "",
        email: "robbe.debackend@move-united.be",
        GSM: "0477777777",
        groep: {
          groep_id: 7,
          groep_naam: "Dolfijnen",
          beschrijving: "Verfijnen drie slagen, afstand- en reddend zwemmen",
          aantal_lesgevers: 1,
        },
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
      });
    });
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

    test("should 200 and return lesgever with given id", async () => {
      const response = await request.get(`${URL}/1`);
      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        lesgever_id: 1,
        lesgever_naam: "Lander Dhaen",
        geboortedatum: new Date(2001, 3, 30, 0).toJSON(),
        type: "Lesvrij",
        aanwezigheidspercentage: 100,
        diploma: "Redder",
        imageURL: "",
        email: "lander.dhaen@gmail.com",
        GSM: "0491882278",
        groep: {
          groep_id: 8,
          groep_naam: "Losse lesgevers",
          beschrijving: "Visie-cel, Coördinatoren, Stuurgroep",
          aantal_lesgevers: 1,
        },
      });
    });
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
      const response = await request.put(`${URL}/1`).send({
        lesgever_naam: "Lander Dhaen 2.0",
        geboortedatum: "2001-03-30T00:00:00.000Z",
        type: "Verantwoordelijke",
        aanwezigheidspercentage: 80,
        diploma: "Animator",
        imageURL: "",
        email: "lander.dhaen@gmail.com",
        GSM: "0491882278",
        groep_id: 8,
      });

      expect(response.status).toBe(200);
      expect(response.body.lesgever_id).toBeTruthy();
      expect(response.body.lesgever_naam).toBe("Lander Dhaen 2.0");
      expect(response.body.geboortedatum).toBe("2001-03-30T00:00:00.000Z");
      expect(response.body.type).toBe("Verantwoordelijke");
      expect(response.body.aanwezigheidspercentage).toBe(80);
      expect(response.body.diploma).toBe("Animator");
      expect(response.body.imageURL).toBe("");
      expect(response.body.email).toBe("lander.dhaen@gmail.com");
      expect(response.body.GSM).toBe("0491882278");
      expect(response.body.groep).toEqual({
        groep_id: 8,
        groep_naam: "Losse lesgevers",
        beschrijving: "Visie-cel, Coördinatoren, Stuurgroep",
        aantal_lesgevers: 1,
      });
    });
  });

  // POST /api/lesgevers

  describe("POST /api/lesgevers", () => {
    const lesgeversToDelete = [];

    // Testdata toevoegen aan database

    beforeAll(async () => {
      await knex(tables.groep).insert(data.groepen);
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
      const response = await request.post(URL).send({
        lesgever_naam: "Fix it Felix",
        geboortedatum: "2001-03-30T00:00:00.000Z",
        type: "Reserve Lesgever",
        aanwezigheidspercentage: 10,
        diploma: "Geen",
        imageURL: "",
        email: "fixitfelix@move-united.be",
        GSM: "0491111111",
        groep_id: 1,
      });

      expect(response.status).toBe(201);
      expect(response.body.lesgever_id).toBeTruthy();
      expect(response.body.lesgever_naam).toBe("Fix it Felix");
      expect(response.body.geboortedatum).toBe("2001-03-30T00:00:00.000Z");
      expect(response.body.type).toBe("Reserve Lesgever");
      expect(response.body.aanwezigheidspercentage).toBe(10);
      expect(response.body.diploma).toBe("Geen");
      expect(response.body.imageURL).toBe("");
      expect(response.body.email).toBe("fixitfelix@move-united.be");
      expect(response.body.GSM).toBe("0491111111");
      expect(response.body.groep).toEqual({
        groep_id: 1,
        groep_naam: "Eendjes",
        beschrijving: "Startgroep, met ouders",
        aantal_lesgevers: 0,
      });

      lesgeversToDelete.push(response.body.lesgever_id);
    });
  });
});
