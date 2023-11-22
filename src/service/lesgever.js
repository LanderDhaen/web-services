const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesgeverRepository = require("../repository/lesgever");
const groepService = require("../service/groep");

// Alle lesgevers ophalen

const getAllLesgever = async () => {
  const items = await lesgeverRepository.getAllLesgever();
  return {
    items,
    count: items.length,
  };
};

// Lesgever ophalen a.d.h.v id

const getLesgeverById = async (id) => {
  const lesgever = await lesgeverRepository.getLesgeverById(id);

  if (!lesgever) {
    throw ServiceError.notFound(`Er bestaat geen lesgever met id ${id}!`, {
      id,
    });
  }

  return lesgever;
};

// Lesgevers ophalen a.d.h.v groep_id

const getLesgeverByGroepId = async (id) => {
  const lesgevers = await lesgeverRepository.getLesgeverByGroepId(id);
  if (!lesgevers) {
    throw ServiceError.notFound(
      `Er bestaan geen lesgevers met groep id ${id}!`,
      {
        id,
      }
    );
  }

  return lesgevers;
};

const createLesgever = async ({
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep_id,
}) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  try {
    const id = await lesgeverRepository.create({
      lesgever_naam,
      geboortedatum,
      type,
      aanwezigheidspercentage,
      diploma,
      imageURL,
      email,
      GSM,
      groep_id,
    });
    return getLesgeverById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesgever updaten a.d.h.v id

const updateLesgeverById = async (
  id,
  {
    lesgever_naam,
    geboortedatum,
    type,
    aanwezigheidspercentage,
    diploma,
    imageURL,
    email,
    GSM,
    groep_id,
  }
) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}.`, {
      groep_id,
    });
  }

  await lesgeverRepository.updateLesgeverById(id, {
    lesgever_naam,
    geboortedatum,
    type,
    aanwezigheidspercentage,
    diploma,
    imageURL,
    email,
    GSM,
    groep_id,
  });
  return getLesgeverById(id);
};

// Lesgever verwijderen a.d.h.v id

const deleteLesgeverById = async (id) => {
  try {
    const deletedLesgever = await lesgeverRepository.deleteLesgeverById(id);

    if (!deletedLesgever) {
      throw ServiceError.notFound(`Er bestaat geen lesgever met id ${id}!`, {
        id,
      });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  getLesgeverByGroepId,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
