const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.les, (table) => {
      table.increments("les_id");
      table.date("datum").notNullable();

      table.integer("lessenreeks_id").unsigned().notNullable();

      table
        .foreign("lessenreeks_id", "fk_les_lessenreeks")
        .references(`${tables.lessenreeks}.lessenreeks_id`)
        .onDelete("CASCADE");
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.les);
  },
};
