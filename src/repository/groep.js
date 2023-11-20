const { format } = require("mysql2");
const { getLogger } = require("../core/logging");
const { tables, getKnex } = require("../data/index");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
];

// Groep(en) formateren

const formatGroep = ({
  groep_id,
  groep_naam,
  beschrijving,
  aantal_lesgevers,
}) => {
  return {
    groep_id,
    groep_naam,
    beschrijving,
    aantal_lesgevers,
  };
};

// Alle groepen ophalen

const getAllGroepen = async () => {
  const groepen = await getKnex()(tables.groep)
    .select(SELECT_COLUMNS)
    .orderBy("groep_id", "ASC");
  return groepen.map(formatGroep);
};

// Groep ophalen a.d.h.v id

const getGroepById = async (id) => {
  const groep = await getKnex()(tables.groep)
    .where(`${tables.groep}.groep_id`, id)
    .first(SELECT_COLUMNS);

  return formatGroep(groep);
};

module.exports = {
  getAllGroepen,
  getGroepById,
};
