const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lessenreeks).delete();

    await knex(tables.lessenreeks).insert([
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
    ]);
  },
};
