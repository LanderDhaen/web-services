const { shutdownData, getKnex, tables } = require("../src/data");

module.exports = async () => {
  await getKnex()(tables.lessenreeks).delete();
  await getKnex()(tables.les).delete();
  await getKnex()(tables.lesgever).delete();
  await getKnex()(tables.groep).delete();
  await getKnex()(tables.lesgeverschema).delete();

  await shutdownData();
};
