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
  const les = await lesService.getLesById(id);

  if (!les) {
    throw ServiceError.notFound(`Er bestaat geen les met id ${id}!`, {
      id,
    });
  }

  const lesgeverschema =
    await lesgeverschemaRepository.getLesgeverschemaByLesId(id);

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema voor les_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema ophalen a.d.h.v. lesgever_id
const getLesgeverschemaByLesgeverId = async (id) => {
  const lesgever = await lesgeverService.getLesgeverById(id);

  if (!lesgever) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema voor lesgever_id ${id}!`,
      {
        id,
      }
    );
  }

  const lesgeverschema =
    await lesgeverschemaRepository.getLesgeverschemaByLesgeverId(id);

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema voor lesgever_id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

// Lesgeverschema aanmaken

const createLesgeverschema = async ({ groep_id, lesgever_id, les_id }) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  const bestaandeLesgever = await lesgeverService.getLesgeverById(lesgever_id);

  if (!bestaandeLesgever) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgever met id ${lesgever_id}!`,
      {
        lesgever_id,
      }
    );
  }

  const bestaandeLes = await lesService.getLesById(les_id);

  if (!bestaandeLes) {
    throw ServiceError.notFound(`Er bestaat geen les met id ${les_id}!`, {
      les_id,
    });
  }

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
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  const bestaandeLesgever = await lesgeverService.getLesgeverById(lesgever_id);

  if (!bestaandeLesgever) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgever met id ${lesgever_id}!`,
      {
        lesgever_id,
      }
    );
  }

  const bestaandeLes = await lesService.getLesById(les_id);

  if (!bestaandeLes) {
    throw ServiceError.notFound(`Er bestaat geen les met id ${les_id}!`, {
      les_id,
    });
  }

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
