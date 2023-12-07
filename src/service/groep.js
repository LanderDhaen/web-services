const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const groepRepository = require("../repository/groep");

// Alle groepen ophalen

const getAllGroepen = async () => {
  const items = await groepRepository.getAllGroepen();
  return { items, count: items.length };
};

// Groep ophalen a.d.h.v id

const getGroepById = async (id) => {
  const groep = await groepRepository.getGroepById(id);

  if (!groep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${id}!`, {
      id,
    });
  }

  return groep;
};

// Groep aanmaken

const createGroep = async ({ groep_naam, beschrijving, aantal_lesgevers }) => {
  try {
    const id = await groepRepository.createGroep({
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    });
    return getGroepById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Groep updaten a.d.h.v id

const updateGroepById = async (
  id,
  { groep_naam, beschrijving, aantal_lesgevers }
) => {
  try {
    await groepRepository.updateGroepById(id, {
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    });
  } catch (error) {
    handleDBError(error);
  }
  return getGroepById(id);
};

// Groep verwijderen a.d.h.v id

const deleteGroepById = async (id) => {
  const groep = await groepRepository.getGroepById(id);

  if (!groep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${id}!`, {
      id,
    });
  }
  try {
    await groepRepository.deleteGroepById(id);
  } catch (error) {
    handleDBError(error);
  }
};

module.exports = {
  getAllGroepen,
  getGroepById,
  createGroep,
  updateGroepById,
  deleteGroepById,
};
