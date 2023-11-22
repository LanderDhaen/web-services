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

const getLesvoorbereidingById = async (lesvoorbereiding_id) => {
  const lesvoorbereiding =
    await lesvoorbereidingRepository.getLesvoorbereidingById(
      lesvoorbereiding_id
    );

  if (!lesvoorbereiding) {
    throw ServiceError.notFound(
      `Er bestaat geen lesvoorbereiding met id ${lesvoorbereiding_id}!`,
      {
        lesvoorbereiding_id,
      }
    );
  }

  return lesvoorbereiding;
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
    const lesvoorbereiding =
      await lesvoorbereidingRepository.createLesvoorbereiding({
        lesvoorbereiding_naam,
        lesvoorbereiding_type,
        link_to_PDF,
        feedback,
        les_id,
        groep_id,
      });
    return getLesvoorbereidingById(lesvoorbereiding.lesvoorbereiding_id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesvoorbereiding updaten a.d.h.v id

const updateLesvoorbereidingById = async (
  lesvoorbereiding_id,
  { link_to_PDF, feedback, les_id, groep_id }
) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);
  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  await lesvoorbereidingRepository.updateLesvoorbereidingById(
    lesvoorbereiding_id,
    { link_to_PDF, feedback, les_id, groep_id }
  );

  return getLesvoorbereidingById(lesvoorbereiding_id);
};

// Lesvoorbereiding verwijderen a.d.h.v id

const deleteLesvoorbereidingById = async (lesvoorbereiding_id) => {
  try {
    const deletedLesvoorbereiding =
      await lesvoorbereidingRepository.deleteLesvoorbereidingById(
        lesvoorbereiding_id
      );

    if (!deletedLesvoorbereiding) {
      throw ServiceError.notFound(
        `Er bestaat geen lesvoorbereiding met id ${lesvoorbereiding_id}!`,
        {
          lesvoorbereiding_id,
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
  createLesvoorbereiding,
  updateLesvoorbereidingById,
  deleteLesvoorbereidingById,
};
