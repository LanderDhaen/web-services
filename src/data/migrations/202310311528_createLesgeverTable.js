const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.lesgever, (table) => {
      table.increments("lesgever_id");
      table.unique("lesgever_id", "idx_lesgever_id_unique");
      table.string("lesgever_naam", 255).notNullable();
      table.dateTime("geboortedatum").notNullable();
      table.string("type", 255).notNullable();
      table.integer("aanwezigheidspercentage").notNullable();
      table.string("diploma", 255).notNullable();
      table.string("imageURL", 255);
      table.string("email", 255).notNullable();
      table.unique("email", "idx_user_email_unique");
      table.string("GSM", 10).notNullable();
      table.unique("GSM", "idx_user_GSM_unique");

      table.integer("groep_id").unsigned().notNullable();

      table
        .foreign("groep_id", "fk_lesgever_groep")
        .references(`${tables.groep}.groep_id`)
        .onDelete("CASCADE");
    });
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.lesgever);
  },
};
