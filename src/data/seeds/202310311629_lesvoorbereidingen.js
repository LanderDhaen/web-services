const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lesvoorbereiding).delete();

    await knex(tables.lesvoorbereiding).insert([
      {
        lesvoorbereiding_id: 1,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar school",
        lesvoorbereiding_type: "Gewone Les",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test",
        les_id: 1,
        groep_id: 3,
      },
      {
        lesvoorbereiding_id: 2,
        lesvoorbereiding_naam: "Jasmijn de Dolfijn maakt een toets",
        lesvoorbereiding_type: "Tussentijds Brevet",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test 2",
        les_id: 7,
        groep_id: 7,
      },
      {
        lesvoorbereiding_id: 3,
        lesvoorbereiding_naam: "Walter de Walrus gaat naar de speeltuin",
        lesvoorbereiding_type: "Speelles",
        link_to_PDF: "https://www.google.com",
        feedback: "Dit is een test 3",
        les_id: 15,
        groep_id: 3,
      },
    ]);
  },
};
