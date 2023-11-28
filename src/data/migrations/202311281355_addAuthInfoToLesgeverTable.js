const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.lesgever, (table) => {
      table.string("password_hash").notNullable();
      table.jsonb("roles").notNullable();
    });
  },
  down: async (knex) => {
    await knex.schema.alterTable(tables.lesgever, (table) => {
      table.dropColumn("password_hash");
      table.dropColumn("roles");
    });
  },
};
