const { tables, getKnex } = require("../data/index");

const getAllGroepen = () => {
  return getKnex()(tables.groep).select().orderBy("id", "ASC");
};

module.exports = {
  getAllGroepen,
};
