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

const updateGroepById = async (
  groep_id,
  { naam, beschrijving, aantal_lesgevers }
) => {
  const groep = await groepRepository.getGroepById(groep_id);

  if (!groep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  try {
    await groepRepository.update(groep_id, {
      naam,
      beschrijving,
      aantal_lesgevers,
    });
  } catch (error) {
    handleDBError(error);
  }
  return getGroepById(groep_id);
};

module.exports = {
  getAllGroepen,
  getGroepById,
  updateGroepById,
};
