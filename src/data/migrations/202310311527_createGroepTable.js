const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.groep, (table) => {
      table.increments("groep_id");
      table.unique("groep_id", "idx_groep_id_unique");
      table.string("groep_naam", 255).notNullable();
      table.unique("groep_naam", "idx_groep_naam_unique");
      table.text("beschrijving").notNullable();
      table.integer("aantal_lesgevers").notNullable();
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.groep);
  },
};
