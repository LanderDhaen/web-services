const c = require("config");
const { tables, getKnex } = require("../data/index");

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
];

// Lesgever(s) formatteren

const formatLesgever = ({
  lesgever_id,
  lesgever_naam,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  groep_id,
  groep_naam,
  beschrijving,
  aantal_lesgevers,
  ...lesgever
}) => {
  return {
    ...lesgever,
    lesgever_id,
    lesgever_naam,
    geboortedatum,
    type,
    aanwezigheidspercentage,
    diploma,
    imageURL,
    email,
    GSM,
    groep: {
      groep_id,
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    },
  };
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

  return lesgevers.map(formatLesgever);
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

  return formatLesgever(lesgever);
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

  return lesgevers.map(formatLesgever);
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
}) => {
  const [lesgever_id] = await getKnex()(tables.lesgever).insert({
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

  return lesgever_id;
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
  await getKnex()(tables.lesgever).where("lesgever_id", id).update({
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
};

// Lesgever verwijderen a.d.h.v id

const deleteLesgeverById = async (id) => {
  await getKnex()(tables.lesgever).where("lesgever_id", id).del();
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  getLesgeverByGroepId,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
