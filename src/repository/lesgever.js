const { tables, getKnex } = require("../data/index");
const { getLogger } = require("../core/logging");
const ServiceError = require("../core/serviceError");
const ObjectMapper = require("object-mapper");

// Kolommen selecteren

const SELECT_COLUMNS = [
  "lesgever_id",
  `${tables.lesgever}.lesgever_naam as lesgever_naam`,
  "geboortedatum",
  "type",
  "aanwezigheidspercentage",
  "diploma",
  "imageURL",
  "email",
  "GSM",
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.groep_naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
  "password_hash",
  "roles",
];

// Lesgever(s) formatteren

const formatLesgever = {
  lesgever_id: "lesgever_id",
  lesgever_naam: "lesgever_naam",
  geboortedatum: "geboortedatum",
  type: "type",
  aanwezigheidspercentage: "aanwezigheidspercentage",
  diploma: "diploma",
  imageURL: "imageURL",
  email: "email",
  GSM: "GSM",
  groep_id: "groep.groep_id",
  groep_naam: "groep.groep_naam",
  beschrijving: "groep.beschrijving",
  aantal_lesgevers: "groep.aantal_lesgevers",
  password_hash: "password_hash",
  roles: "roles",
};

// Alle lesgevers ophalen

const getAllLesgever = async () => {
  const lesgevers = await getKnex()(tables.lesgever)
    .join(
      tables.groep,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .select(SELECT_COLUMNS)
    .orderBy("lesgever_id", "ASC");

  return lesgevers.map((lesgever) => ObjectMapper(lesgever, formatLesgever));
};

// Lesgever ophalen a.d.h.v id

const getLesgeverById = async (id) => {
  const lesgever = await getKnex()(tables.lesgever)
    .join(
      tables.groep,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where("lesgever_id", id)
    .first(SELECT_COLUMNS);

  return ObjectMapper(lesgever, formatLesgever);
};

// Lesgever ophalen a.d.h.v email

const getLesgeverByEmail = (email) => {
  return getKnex()(tables.lesgever).where("email", email).first();
};

// Lesgevers ophalen a.d.h.v groep_id

const getLesgeverByGroepId = async (id) => {
  const lesgevers = await getKnex()(tables.lesgever)
    .join(
      tables.groep,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where(`${tables.lesgever}.groep_id`, id)
    .select(SELECT_COLUMNS);

  return lesgevers.map((lesgever) => ObjectMapper(lesgever, formatLesgever));
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
  password_hash,
  roles,
}) => {
  try {
    const [id] = await getKnex()(tables.lesgever).insert({
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
      roles: JSON.stringify(roles),
    });

    return id;
  } catch (error) {
    getLogger().error("Error creating lesgever", { error });

    throw error;
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
    password_hash,
    roles,
  }
) => {
  try {
    await getKnex()(tables.lesgever)
      .where("lesgever_id", id)
      .update({
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
        roles: JSON.stringify(roles),
      });
  } catch (error) {
    getLogger().error("Error updating lesgever", { error });
    throw error;
  }
};

// Lesgever verwijderen a.d.h.v id

const deleteLesgeverById = async (id) => {
  try {
    await getKnex()(tables.lesgever).where("lesgever_id", id).del();
  } catch (error) {
    getLogger().error("Error deleting lesgever", { error });
    throw error;
  }
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  getLesgeverByEmail,
  getLesgeverByGroepId,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
