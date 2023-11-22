const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesgeverRepository = require("../repository/lesgever");
const groepService = require("../service/groep");

const getAllLesgever = async () => {
  const items = await lesgeverRepository.getAllLesgever();
  return {
    items,
    count: items.length,
  };
};

const getLesgeverById = async (id) => {
  const lesgever = await lesgeverRepository.getLesgeverById(id);

  if (!lesgever) {
    throw ServiceError.notFound(`Er bestaat geen lesgever met id ${id}!`, {
      id,
    });
  }

  return lesgever;
};

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
  naam,
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
    const lesgever_id = await lesgeverRepository.create({
      naam,
      geboortedatum,
      type,
      aanwezigheidspercentage,
      diploma,
      imageURL,
      email,
      GSM,
      groep_id,
    });
    return getLesgeverById(lesgever_id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateLesgeverById = async (
  lesgever_id,
  {
    naam,
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

  await lesgeverRepository.update(lesgever_id, {
    naam,
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

const deleteLesgeverById = async (id) => {
  try {
    const deletedLesgever = await lesgeverRepository.delete(id);

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
