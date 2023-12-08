const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const config = require("config"); // 👈 7
const { getLogger } = require("../core/logging"); // 👈 4
const { generateJWT, verifyJWT } = require("../core/jwt");
const lesgeverRepository = require("../repository/lesgever");
const groepService = require("../service/groep");
const { hashPassword, verifyPassword } = require("../core/password"); // 👈 4

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
  const bestaandeGroep = await groepService.getGroepById(id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${id}!`, {
      id,
    });
  }

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
    password,
    roles,
  }
) => {
  const bestaandeGroep = await groepService.getGroepById(groep_id);

  if (!bestaandeGroep) {
    throw ServiceError.notFound(`Er bestaat geen groep met id ${groep_id}.`, {
      groep_id,
    });
  }

  try {
    const password_hash = await hashPassword(password);

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
      password_hash,
      roles,
    });
    return getLesgeverById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesgever verwijderen a.d.h.v id

const deleteLesgeverById = async (id) => {
  const lesgever = await lesgeverRepository.getLesgeverById(id);

  if (!lesgever) {
    throw ServiceError.notFound(`Er bestaat geen lesgever met id ${id}!`, {
      id,
    });
  }

  try {
    await lesgeverRepository.deleteLesgeverById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesgever zonder wachtwoord teruggeven

const makeExposedLesgever = ({
  lesgever_id,
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep,
  roles,
}) => ({
  lesgever_id,
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep,
  roles,
});

// Controleren van JWT

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, lesgever_id } = await verifyJWT(authToken);

    return {
      lesgever_id,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
};

// Controleren van rollen

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role); // 👈 1

  if (!hasPermission) {
    throw ServiceError.forbidden(
      "You are not allowed to view this part of the application"
    );
  }
};

// Lesgever inloggen

const makeLoginData = async (lesgever) => {
  const token = await generateJWT(lesgever);

  return {
    lesgever_id: lesgever.lesgever_id,
    roles: lesgever.roles,
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
  checkAndParseSession,
  checkRole,
  login,
};
