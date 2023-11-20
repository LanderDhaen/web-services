const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.lesvoorbereiding, (table) => {
      table.increments("lesvoorbereiding_id");
      table.string("lesvoorbereiding_naam", 255).notNullable();
      table.string("lesvoorbereiding_type", 255).notNullable();
      table.string("link_to_PDF").notNullable();
      table.string("feedback", 255).notNullable();

      table.integer("les_id").unsigned().notNullable();

      table
        .foreign("les_id", "fk_lesvoorbereiding_les")
        .references(`${tables.les}.les_id`)
        .onDelete("CASCADE");

      table.integer("groep_id").unsigned().notNullable();

      table
        .foreign("groep_id", "fk_lesvoorbereiding_groep")
        .references(`${tables.groep}.groep_id`)
        .onDelete("CASCADE");
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.lesvoorbereiding);
  },
};
