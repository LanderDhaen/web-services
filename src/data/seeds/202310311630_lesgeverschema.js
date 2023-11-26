const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lesgeverschema).delete();

    await knex(tables.lesgeverschema).insert([
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
        les_id: 1,
        groep_id: 7,
        lesgever_id: 3,
      },
      {
        les_lesgever_id: 4,
        les_id: 7,
        groep_id: 3,
        lesgever_id: 2,
      },
      {
        les_lesgever_id: 5,
        les_id: 15,
        groep_id: 7,
        lesgever_id: 3,
      },
    ]);
  },
};
