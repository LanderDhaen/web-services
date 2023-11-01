const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lesgever).delete();

    await knex(tables.lesgever).insert([
      {
        lesgever_id: 1,
        naam: "Lander Dhaen",
        groep: "Los",
        geboortedatum: new Date(2001, 3, 30, 0),
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
        naam: "Robbe De Back-End",
        groep: "Dolfijnen",
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
        naam: "Lander 2.0",
        groep: "Waterschildpadden",
        geboortedatum: new Date(2001, 3, 30, 0),
        type: "Vaste Lesgever",
        aanwezigheidspercentage: 100,
        diploma: "Geen",
        imageURL: "",
        email: "lander.dhaen@move-united.be",
        GSM: "0491882278",
        groep_id: 3,
      },
      {
        lesgever_id: 4,
        naam: "Lander Dhaen",
        groep: "Dolfijnen",
        geboortedatum: new Date(2001, 3, 30, 0),
        type: "Verantwoordelijke",
        aanwezigheidspercentage: 0,
        diploma: "Leerkracht LO",
        imageURL: "",
        email: "lander.dhaen@gmail.com",
        GSM: "0491882278",
        groep_id: 7,
      },
    ]);
  },
};
