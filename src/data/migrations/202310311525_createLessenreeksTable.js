const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.lessenreeks, (table) => {
      table.increments("lessenreeks_id");
      table.unique("lessenreeks_id", "idx_lessenreeks_id_unique");
      table.string("jaargang", 9).notNullable();
      table.integer("nummer").notNullable();
      table.date("startdatum").notNullable();
      table.date("einddatum").notNullable();
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.lessenreeks);
  },
};
