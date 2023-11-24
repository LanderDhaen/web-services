const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lessenreeksRepository = require("../repository/lessenreeks");

// Alle lessenreeksen ophalen

const getAllLessenreeks = async () => {
  const items = await lessenreeksRepository.getAllLessenreeks();
  return {
    items,
    count: items.length,
  };
};

// Lessenreeks ophalen a.d.h.v id

const getLessenreeksById = async (id) => {
  const lessenreeks = await lessenreeksRepository.getLessenreeksById(id);

  if (!lessenreeks) {
    throw ServiceError.notFound(`Er bestaat geen lessenreeks met id ${id}!`, {
      id,
    });
  }

  return lessenreeks;
};

const createLessenreeks = async ({
  jaargang,
  nummer,
  startdatum,
  einddatum,
}) => {
  try {
    const id = await lessenreeksRepository.createLessenreeks({
      jaargang,
      nummer,
      startdatum,
      einddatum,
    });
    return getLessenreeksById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lessenreeks updaten a.d.h.v id

const updateLessenreeksById = async (
  id,
  { jaargang, nummer, startdatum, einddatum }
) => {
  const lessenreeks = await lessenreeksRepository.getLessenreeksById(id);

  if (!lessenreeks) {
    throw ServiceError.notFound(`Er bestaat geen lessenreeks met id ${id}!`, {
      id,
    });
  }

  try {
    await lessenreeksRepository.updateLessenreeksById(id, {
      jaargang,
      nummer,
      startdatum,
      einddatum,
    });
    return getLessenreeksById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lessenreeks verwijderen a.d.h.v id

const deleteLessenreeksById = async (id) => {
  const lessenreeks = await lessenreeksRepository.getLessenreeksById(id);

  if (!lessenreeks) {
    throw ServiceError.notFound(`Er bestaat geen lessenreeks met id ${id}!`, {
      id,
    });
  }

  try {
    await lessenreeksRepository.deleteLessenreeksById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAllLessenreeks,
  getLessenreeksById,
  createLessenreeks,
  updateLessenreeksById,
  deleteLessenreeksById,
};
