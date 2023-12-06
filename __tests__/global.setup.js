const config = require("config"); // 👈 2
const { initializeLogger } = require("../src/core/logging"); // 👈 2
const Role = require("../src/core/roles"); // 👈 4
const { initializeData, getKnex, tables } = require("../src/data"); // 👈 3 en 4

// 👇 1
module.exports = async () => {
  // Create a database connection
  // 👇 2
  initializeLogger({
    level: config.get("log.level"),
    disabled: config.get("log.disabled"),
  });
  await initializeData(); // 👈 3

  // Insert a test user with password 12345678
  const knex = getKnex(); // 👈 3

  // 👇 4

  await knex(tables.groep).insert([
    {
      groep_id: 3,
      groep_naam: "Waterschildpadden",
      beschrijving: "Watergewenning, ontdekken diep",
      aantal_lesgevers: 1,
    },
  ]);

  await knex(tables.lesgever).insert([
    {
      lesgever_id: 1,
      lesgever_naam: "Test User",
      geboortedatum: new Date(2001, 3, 30, 0),
      type: "Lesvrij",
      aanwezigheidspercentage: 100,
      diploma: "Redder",
      imageURL: "",
      email: "test.user@gmail.com",
      GSM: "0491882278",
      groep_id: 3,
      password_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
      roles: JSON.stringify([Role.LESGEVER]),
    },
    {
      lesgever_id: 2,
      lesgever_naam: "Admin User",
      geboortedatum: new Date(2001, 3, 30, 0),
      type: "Verantwoordelijke",
      aanwezigheidspercentage: 100,
      diploma: "Animator",
      imageURL: "",
      email: "test.admin@gmail.com",
      GSM: "0491228878",
      groep_id: 3,
      password_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
      roles: JSON.stringify([Role.STUURGROEP, Role.LESGEVER]),
    },
  ]);
};
