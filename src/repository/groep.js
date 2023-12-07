const { getLogger } = require("../core/logging");
const { tables, getKnex } = require("../data/index");
const ServiceError = require("../core/serviceError");
const ObjectMapper = require("object-mapper");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.groep_naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
];

// Groep(en) formateren

const formatGroep = {
  groep_id: "groep_id",
  groep_naam: "groep_naam",
  beschrijving: "beschrijving",
  aantal_lesgevers: "aantal_lesgevers",
};

// Alle groepen ophalen

const getAllGroepen = async () => {
  const groepen = await getKnex()(tables.groep)
    .select(SELECT_COLUMNS)
    .orderBy("groep_id", "ASC");
  return groepen.map((groep) => ObjectMapper(groep, formatGroep));
};

// Groep ophalen a.d.h.v id

const getGroepById = async (id) => {
  const groep = await getKnex()(tables.groep)
    .where(`${tables.groep}.groep_id`, id)
    .first(SELECT_COLUMNS);

  return ObjectMapper(groep, formatGroep);
};

// Groep aanmaken

const createGroep = async ({ groep_naam, beschrijving, aantal_lesgevers }) => {
  try {
    const [id] = await getKnex()(tables.groep).insert({
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    });

    return id;
  } catch (error) {
    getLogger().error("Error creating groep", {
      error,
    });
    throw error;
  }
};

// Groep updaten a.d.h.v id

const updateGroepById = async (
  id,
  { groep_naam, beschrijving, aantal_lesgevers }
) => {
  try {
    await getKnex()(tables.groep).where("groep_id", id).update({
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    });
    return id;
  } catch (error) {
    getLogger().error("Error updating groep", {
      error,
    });
    throw error;
  }
};

// Groep verwijderen a.d.h.v id

const deleteGroepById = async (id) => {
  try {
    await getKnex()(tables.groep).where("groep_id", id).del();
  } catch (error) {
    getLogger().error("Error deleting groep", {
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllGroepen,
  getGroepById,
  createGroep,
  updateGroepById,
  deleteGroepById,
};
