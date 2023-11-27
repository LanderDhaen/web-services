const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesgeverschemaRepository = require("../repository/lesgeverschema");

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

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema ophalen a.d.h.v. les_id

const getLesgeverschemaByLesId = async (id) => {
  const lesgeverschema =
    await lesgeverschemaRepository.getLesgeverschemaByLesId(id);

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met les_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema aanmaken

const createLesgeverschema = async ({ groep_id, lesgever_id, les_id }) => {
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

module.exports = {
  getAllLesgeverschema,
  getLesgeverschemaById,
  getLesgeverschemaByLesId,
  createLesgeverschema,
};
