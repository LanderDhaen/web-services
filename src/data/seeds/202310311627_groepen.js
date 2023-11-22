const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.groep).delete();

    await knex(tables.groep).insert([
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
    ]);
  },
};
