const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const groepRepository = require("../repository/groep");

const getAllGroepen = async () => {
  const items = await groepRepository.getAllGroepen();
  return { items, count: items.length };
};

const getGroepById = async (id) => {
  const groep = await groepRepository.getGroepById(id);

  if (!groep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${id}!`, {
      id,
    });
  }

  return groep;
};

module.exports = {
  getAllGroepen,
  getGroepById,
};
