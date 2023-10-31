const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.groep, (table) => {
      table.increments("groep_id");
      table.string("naam", 255).notNullable();
      table.string("beschrijving", 255).notNullable();
      table.integer("aantal_lesgevers").notNullable();
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.groep);
  },
};
