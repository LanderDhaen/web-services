let { LESGEVER_DATA } = require("../data/mock-data");

const getAllLesgever = () => {
  return { items: LESGEVER_DATA, count: LESGEVER_DATA.length };
};

const getLesgeverById = (id) => {
  throw new Error("Not implemented yet!");
};

const createLesgever = ({
  naam,
  groep,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
}) => {
  throw new Error("Not implemented yet!");
};

const updateLesgeverById = (
  id,
  {
    naam,
    groep,
    geboortedatum,
    type,
    aanwezigheidspercentage,
    diploma,
    imageURL,
    email,
    GSM,
  }
) => {
  throw new Error("Not implemented yet!");
};

const deleteLesgeverById = (id) => {
  throw new Error("Not implemented yet!");
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
