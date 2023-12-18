const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesvoorbereidingRepository = require("../repository/lesvoorbereiding");
const groepService = require("../service/groep");
const lesService = require("../service/les");

// Alle lesvoorbereidingen ophalen

const getAllLesvoorbereidingen = async () => {
  const items = await lesvoorbereidingRepository.getAllLesvoorbereidingen();
  return { items, count: items.length };
};

// Lesvoorbereiding ophalen a.d.h.v id

const getLesvoorbereidingById = async (id) => {
  const lesvoorbereiding =
    await lesvoorbereidingRepository.getLesvoorbereidingById(id);

  if (!lesvoorbereiding) {
    throw ServiceError.notFound(
      `Er bestaat geen lesvoorbereiding met id ${id}!`,
      {
        id,
      }
    );
  }

  return lesvoorbereiding;
};

// Lesvoorbereidingen ophalen a.d.h.v groep_id

const getLesvoorbereidingByGroepId = async (id) => {
  // Controleren of groep bestaat

  await groepService.getGroepById(id);

  const lesvoorbereidingen =
    await lesvoorbereidingRepository.getLesvoorbereidingByGroepId(id);

  if (lesvoorbereidingen.length === 0) {
    throw ServiceError.notFound(
      `Er bestaan geen lesvoorbereidingen voor groep met groep_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesvoorbereidingen;
};

// Lesvoorbereiding aanmaken

const createLesvoorbereiding = async ({
  lesvoorbereiding_naam,
  lesvoorbereiding_type,
  link_to_PDF,
  feedback,
  les_id,
  groep_id,
}) => {
  // Controleren of groep en les bestaan

  await groepService.getGroepById(groep_id);
  await lesService.getLesById(les_id);

  try {
    const id = await lesvoorbereidingRepository.createLesvoorbereiding({
      lesvoorbereiding_naam,
      lesvoorbereiding_type,
      link_to_PDF,
      feedback,
      les_id,
      groep_id,
    });
    return getLesvoorbereidingById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesvoorbereiding updaten a.d.h.v id

const updateLesvoorbereidingById = async (
  id,
  {
    lesvoorbereiding_naam,
    lesvoorbereiding_type,
    link_to_PDF,
    feedback,
    les_id,
    groep_id,
  }
) => {
  // Controleren of groep en les bestaan

  await groepService.getGroepById(groep_id);
  await lesService.getLesById(les_id);

  try {
    await lesvoorbereidingRepository.updateLesvoorbereidingById(id, {
      lesvoorbereiding_naam,
      lesvoorbereiding_type,
      link_to_PDF,
      feedback,
      les_id,
      groep_id,
    });
    return getLesvoorbereidingById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesvoorbereiding verwijderen a.d.h.v id

const deleteLesvoorbereidingById = async (id) => {
  // Controleren of lesvoorbereiding bestaat

  const lesvoorbereiding =
    await lesvoorbereidingRepository.getLesvoorbereidingById(id);

  if (!lesvoorbereiding) {
    throw ServiceError.notFound(
      `Er bestaat geen lesvoorbereiding met id ${id}!`,
      {
        id,
      }
    );
  }
  try {
    await lesvoorbereidingRepository.deleteLesvoorbereidingById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAllLesvoorbereidingen,
  getLesvoorbereidingById,
  getLesvoorbereidingByGroepId,
  createLesvoorbereiding,
  updateLesvoorbereidingById,
  deleteLesvoorbereidingById,
};
