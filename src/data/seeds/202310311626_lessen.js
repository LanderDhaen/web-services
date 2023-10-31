const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.les).delete();

    await knex(tables.les).insert([
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
    ]);
  },
};
