const { tables, getKnex } = require("../data/index");

// Alle lesgevers ophalen

const getAllLesgever = () => {
  return getKnex()(tables.lesgever).select().orderBy("groep", "ASC");
};

// Lesgever ophalen a.d.h.v id

const SELECT_COLUMNS = [
  "lesgever_id",
  `${tables.lesgever}.naam as lesgever_naam`,
  `${tables.lesgever}.groep_id as lesgever_groep`,
  "geboortedatum",
  "type",
  "aanwezigheidspercentage",
  "diploma",
  "imageURL",
  "email",
  "GSM",
];

const formatLesgever = ({
  lesgever_id,
  lesgever_naam,
  lesgever_groep,
  geboortedatum,
  type,
  aanwezigheidspercentage,
  diploma,
  imageURL,
  email,
  GSM,
  ...rest
}) => ({
  ...rest,
  groep: {
    naam: groep_naam,
    beschrijving: groep_beschrijving,
  },
});

const getLesgeverById = async (id) => {
  const lesgever = await getKnex()(tables.transaction)
    .join(
      tables.lesgever,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where("lesgever_id", id)
    .first(SELECT_COLUMNS);

  return lesgever && formatLesgever(lesgever);
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

const updateLesgeverById = async (id) => {
  await getKnex()(tables.lesgever).where("lesgever_id", id).update({
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

const deleteLesgeverById = async (id) => {
  await getKnex()(tables.lesgever).where("lesgever_id", id).del();
};

module.exports = {
  getAllLesgever,
  getLesgeverById,
  createLesgever,
  updateLesgeverById,
  deleteLesgeverById,
};
