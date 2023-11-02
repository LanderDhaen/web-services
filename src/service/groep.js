const groepRepository = require("../repository/groep");

const getAllGroepen = async () => {
  const items = await groepRepository.getAllGroepen();
  return { items, count: items.length };
};

const getGroepById = async (groep_id) => {
  const groep = await groepRepository.getGroepById(groep_id);

  if (!groep) {
    throw Error(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  return groep;
};

const createGroep = ({ naam, beschrijving, aantal_lesgevers }) => {
  throw new Error("Not implemented yet!");
};

const updateGroepByID = (id, { naam, beschrijving, aantal_lesgevers }) => {
  throw new Error("Not implemented yet!");
};

const deleteGroepById = (id) => {
  throw new Error("Not implemented yet!");
};

module.exports = {
  getAllGroepen,
  getGroepById,
  createGroep,
  updateGroepByID,
  deleteGroepById,
};
