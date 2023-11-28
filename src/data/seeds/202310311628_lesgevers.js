const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.lesgever).delete();

    await knex(tables.lesgever).insert([
      {
        lesgever_id: 1,
        lesgever_naam: "Lander Dhaen",
        geboortedatum: new Date(2001, 3, 30, 0),
        type: "Lesvrij",
        aanwezigheidspercentage: 100,
        diploma: "Redder",
        imageURL: "",
        email: "lander.dhaen@gmail.com",
        GSM: "0491882278",
        groep_id: 8,
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify(["admin, user"]),
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
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify(["admin, user"]),
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
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify(["admin, user"]),
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
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify(["user"]),
      },
    ]);
  },
};
