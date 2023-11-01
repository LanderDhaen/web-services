const { tables, getKnex } = require("../data/index");

// Kolommen selecter

const SELECT_COLUMNS = [
  "lesgever_id",
  `${tables.lesgever}.naam as lesgever_naam`,
  "groep",
  "geboortedatum",
  "type",
  "aanwezigheidspercentage",
  "diploma",
  "imageURL",
  "email",
  "GSM",
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
];

// Lesgever formatteren

const formatLesgever = ({
  lesgever_id,
  lesgerver_naam,
  groep,
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
  ...rest
}) => {
  return {
    ...rest,
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

const getLesgeverById = async (lesgever_id) => {
  const lesgever = await getKnex()(tables.lesgever)
    .join(
      tables.groep,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where("lesgever_id", lesgever_id)
    .first(SELECT_COLUMNS);

  return formatLesgever(lesgever);
};

// Lesgever aanmaken

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
  const [lesgever_id] = await getKnex()(tables.lesgever).insert({
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

  return lesgever_id;
};

// Lesgeverinformatie updaten

const updateLesgeverById = async (lesgever_id) => {
  await getKnex()(tables.lesgever).where("lesgever_id", lesgever_id).update({
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
};

// Lesgever verwijderen

const deleteLesgeverById = async (lesgever_id) => {
  await getKnex()(tables.lesgever).where("lesgever_id", lesgever_id).del();
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
