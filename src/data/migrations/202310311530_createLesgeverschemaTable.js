const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.lesgeverschema, (table) => {
      table.increments("les_lesgever_id");
      table.unique("les_lesgever_id", "idx_les_lesgever_id_unique");
      table.integer("groep_id").notNullable();

      table.integer("les_id").unsigned().notNullable();
      table
        .foreign("les_id", "fk_lesgeverschema_les")
        .references(`${tables.les}.les_id`)
        .onDelete("CASCADE");

      table.integer("lesgever_id").unsigned().notNullable();
      table
        .foreign("lesgever_id", "fk_lesgeverschema_lesgever")
        .references(`${tables.lesgever}.lesgever_id`)
        .onDelete("CASCADE");
    });
  },
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.lesgeverschema);
  },
};
