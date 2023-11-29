const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const lesgeverRepository = require("../repository/lesgever");
const groepService = require("../service/groep");
const { hashPassword, verifyPassword } = require("../core/password"); // 👈 4
const { generateJWT } = require("../core/jwt"); // 👈 7

// Alle lesgevers ophalen

const getAllLesgever = async () => {
  const items = await lesgeverRepository.getAllLesgever();
  return {
    items: items.map(makeExposedLesgever),
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

  return makeExposedLesgever(lesgever);
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

  return lesgevers.map(makeExposedLesgever);
};

// Lesgever aanmaken

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
  password,
}) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}!`, {
      groep_id,
    });
  }

  try {
    const password_hash = await hashPassword(password);

    const id = await lesgeverRepository.createLesgever({
      lesgever_naam,
      geboortedatum,
      type,
      aanwezigheidspercentage,
      diploma,
      imageURL,
      email,
      GSM,
      groep_id,
      password_hash,
      roles: ["user"],
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

// Lesgever inloggen

const makeExposedLesgever = ({
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep_id,
  roles,
}) => ({
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep_id,
  roles,
});

const makeLoginData = async (lesgever) => {
  const token = await generateJWT(lesgever);
  return {
    lesgever: makeExposedLesgever(lesgever),
    token,
  };
};

const login = async (email, password) => {
  const lesgever = await lesgeverRepository.getLesgeverByEmail(email); // 👈 2

  if (!lesgever) {
    // NIET tonen dat we de lesgever niet kennen

    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  const passwordValid = await verifyPassword(password, lesgever.password_hash); // 👈 4
  // 👇 5
  if (!passwordValid) {
    // NIET tonen dat we de lesgever kennen, maar het wachtwoord niet klopt
    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  return await makeLoginData(lesgever); // 👈 6
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  getLesgeverByGroepId,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
  login,
};
