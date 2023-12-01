const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.les).delete();

    await knex(tables.les).insert([
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
      {
        les_id: 15,
        datum: new Date("2023-12-30"),
        lessenreeks_id: 1,
      },
      {
        les_id: 7,
        datum: new Date("2024-04-20"),
        lessenreeks_id: 2,
      },
    ]);
  },
};
