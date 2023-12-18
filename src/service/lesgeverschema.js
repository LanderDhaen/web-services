const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesgeverschemaRepository = require("../repository/lesgeverschema");
const groepService = require("../service/groep");
const lesgeverService = require("../service/lesgever");
const lesService = require("../service/les");
const lesgever = require("../rest/lesgever");

// Alle lesgeverschema's ophalen

const getAllLesgeverschema = async () => {
  const items = await lesgeverschemaRepository.getAllLesgeverschema();
  return { items, count: items.length };
};

// Lesgeverschema ophalen a.d.h.v. id

const getLesgeverschemaById = async (id) => {
  const lesgeverschema = await lesgeverschemaRepository.getLesgeverschemaById(
    id
  );

  return lesgeverschema;
};

// Lesgeverschema ophalen a.d.h.v. les_id

const getLesgeverschemaByLesId = async (id) => {
  // Controleren of les bestaat

  await lesService.getLesById(id);

  const lesgeverschema =
    await lesgeverschemaRepository.getLesgeverschemaByLesId(id);

  if (lesgeverschema.length === 0) {
    throw ServiceError.notFound(
      `Er bestaan geen lesgeverschemas voor les_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema ophalen a.d.h.v. lesgever_id
const getLesgeverschemaByLesgeverId = async (id) => {
  // Controleren of lesgever bestaat
  await lesgeverService.getLesgeverById(id);

  const lesgeverschema =
    await lesgeverschemaRepository.getLesgeverschemaByLesgeverId(id);

  if (lesgeverschema.length === 0) {
    throw ServiceError.notFound(
      `Er bestaan geen lesgeverschemas voor lesgever_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema aanmaken

const createLesgeverschema = async ({ groep_id, lesgever_id, les_id }) => {
  // Controleren of groep, lesgever en les bestaan

  await groepService.getGroepById(groep_id);
  await lesgeverService.getLesgeverById(lesgever_id);
  await lesService.getLesById(les_id);

  try {
    const id = await lesgeverschemaRepository.createLesgeverschema({
      groep_id,
      lesgever_id,
      les_id,
    });
    return getLesgeverschemaById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesgeverschema updaten a.d.h.v. id

const updateLesgeverschemaById = async (
  id,
  { groep_id, lesgever_id, les_id }
) => {
  // Controleren of groep, lesgever en les bestaan

  await groepService.getGroepById(groep_id);
  await lesgeverService.getLesgeverById(lesgever_id);
  await lesService.getLesById(les_id);

  try {
    await lesgeverschemaRepository.updateLesgeverschemaById(id, {
      groep_id,
      lesgever_id,
      les_id,
    });
    return getLesgeverschemaById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesgeverschema verwijderen a.d.h.v. lesgever_id

const deleteLesgeverschemaById = async (id) => {
  const lesgeverschema = await lesgeverschemaRepository.getLesgeverschemaById(
    id
  );

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met id ${id}!`,
      {
        id,
      }
    );
  }

  try {
    await lesgeverschemaRepository.deleteLesgeverschemaById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAllLesgeverschema,
  getLesgeverschemaById,
  getLesgeverschemaByLesId,
  getLesgeverschemaByLesgeverId,
  createLesgeverschema,
  updateLesgeverschemaById,
  deleteLesgeverschemaById,
};
