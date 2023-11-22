const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const groepRepository = require("../repository/groep");
const { get } = require("config");

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
    const groep = await groepRepository.create({
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    });
    return getGroepById(groep.groep_id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Groep updaten a.d.h.v id

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

// Groep verwijderen a.d.h.v id

const deleteGroepById = async (groep_id) => {
  const groep = await groepRepository.getGroepById(groep_id);

  if (!groep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  try {
    await groepRepository.delete(groep_id);
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
