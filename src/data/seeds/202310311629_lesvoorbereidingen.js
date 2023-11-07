const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lesvoorbereiding).delete();

    await knex(tables.lesvoorbereiding).insert([
      {
        lesvoorbereiding_id: 1,
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les_id: 1,
        groep_id: 3,
      },
      {
        lesvoorbereiding_id: 2,
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test 2",
        les_id: 7,
        groep_id: 7,
      },
      {
        lesvoorbereiding_id: 3,
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test 3",
        les_id: 15,
        groep_id: 3,
      },
    ]);
  },
};
