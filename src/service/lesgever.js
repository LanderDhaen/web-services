const lesgeverRepository = require("../repository/lesgever");
const groepService = require("../service/groep");

const getAllLesgever = async () => {
  const items = await lesgeverRepository.getAllLesgever();
  return {
    items,
    count: items.length,
  };
};

const getLesgeverById = async (lesgever_id) => {
  const lesgever = await lesgeverRepository.findById(lesgever_id);

  if (!lesgever) {
    throw Error(`Er bestaat geen lesgever met id ${lesgever_id}!`, {
      lesgever_id,
    });
  }

  return lesgever;
};

const createLesgever = async ({
  naam,
  groep,
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
    throw Error(`Er bestaat geen groep met id ${groep_id}.`, { groep_id });
  }

  const lesgever_id = await lesgeverRepository.create({
    naam,
    groep,
    geboortedatum,
    type,
    aanwezigheidspercentage,
    diploma,
    imageURL,
    email,
    GSM,
    groep_id,
  });

  return getLesgeverById(lesgever.id);
};

const updateLesgeverById = async (
  lesgever_id,
  {
    naam,
    groep,
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
    throw Error(`Er bestaat geen groep met id ${groep_id}.`, { groep_id });
  }

  await lesgeverRepository.update(lesgever_id, {
    naam,
    groep,
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

const deleteLesgeverById = async (lesgever_id) => {
  const deletedLesgever = await lesgeverRepository.delete(lesgever_id);

  if (!deletedLesgever) {
    throw Error(`Er bestaat geen lesgever met id ${lesgever_id}!`, {
      lesgever_id,
    });
  }
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
