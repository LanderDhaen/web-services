let { GROEP_DATA } = require("../data/mock_data");

const getAllGroepen = () => {
  return { items: GROEP_DATA, count: GROEP_DATA.length };
};

const getGroepById = (id) => {
  throw new Error("Not implemented yet!");
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
