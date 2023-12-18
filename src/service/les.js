const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesRepository = require("../repository/les");
const lessenreeksService = require("../service/lessenreeks");

// Alle lessen ophalen

const getAllLessen = async () => {
  const items = await lesRepository.getAllLessen();
  return {
    items,
    count: items.length,
  };
};

// Les ophalen a.d.h.v id

const getLesById = async (id) => {
  const les = await lesRepository.getLesById(id);

  if (!les) {
    throw ServiceError.notFound(`Er bestaat geen les met id ${id}!`, {
      id,
    });
  }

  return les;
};

// Lessen ophalen a.d.h.v lessenreeks_id

const getLesByLessenreeksId = async (id) => {
  // Controleren of lessenreeks bestaat

  await lessenreeksService.getLessenreeksById(id);

  // Ophalen van lessen

  const lessen = await lesRepository.getLesByLessenreeksId(id);
  if (lessen.length === 0) {
    throw ServiceError.notFound(
      `Er bestaan geen lessen met lessenreeks id ${id}!`,
      {
        id,
      }
    );
  }

  return lessen;
};

// Les aanmaken

const createLes = async ({ datum, lessenreeks_id }) => {
  // Controleren of lessenreeks bestaat

  await lessenreeksService.getLessenreeksById(lessenreeks_id);

  try {
    const id = await lesRepository.createLes({
      datum,
      lessenreeks_id,
    });
    return getLesById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Les updaten a.d.h.v id

const updateLesById = async (id, { datum, lessenreeks_id }) => {
  // Controleren of lessenreeks bestaat

  await lessenreeksService.getLessenreeksById(lessenreeks_id);

  try {
    await lesRepository.updateLesById(id, {
      datum,
      lessenreeks_id,
    });
    return getLesById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

//  Les verwijderen a.d.h.v id

const deleteLesById = async (id) => {
  const les = await lesRepository.getLesById(id);

  if (!les) {
    throw ServiceError.notFound(`Er bestaat geen les met id ${id}!`, {
      id,
    });
  }

  try {
    await lesRepository.deleteLesById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAllLessen,
  getLesById,
  getLesByLessenreeksId,
  createLes,
  updateLesById,
  deleteLesById,
};
