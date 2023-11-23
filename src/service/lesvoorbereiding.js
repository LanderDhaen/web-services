const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesvoorbereidingRepository = require("../repository/lesvoorbereiding");
const groepService = require("../service/groep");

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
  const lesvoorbereidingen =
    await lesvoorbereidingRepository.getLesvoorbereidingByGroepId(id);

  if (!lesvoorbereidingen) {
    throw ServiceError.notFound(
      `Er bestaat geen lesvoorbereiding met groep_id ${gid}!`,
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
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

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
  const bestaandeGroep = await groepService.getGroepById(groep_id);
  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  await lesvoorbereidingRepository.updateLesvoorbereidingById(id, {
    lesvoorbereiding_naam,
    lesvoorbereiding_type,
    link_to_PDF,
    feedback,
    les_id,
    groep_id,
  });

  return getLesvoorbereidingById(id);
};

// Lesvoorbereiding verwijderen a.d.h.v id

const deleteLesvoorbereidingById = async (id) => {
  try {
    const deletedLesvoorbereiding =
      await lesvoorbereidingRepository.deleteLesvoorbereidingById(id);

    if (!deletedLesvoorbereiding) {
      throw ServiceError.notFound(
        `Er bestaat geen lesvoorbereiding met id ${id}!`,
        {
          id,
        }
      );
    }
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
