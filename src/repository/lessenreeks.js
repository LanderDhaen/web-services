const { getLogger } = require("../core/logging");
const { tables, getKnex } = require("../data/index");
const ObjectMapper = require("object-mapper");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.lessenreeks}.lessenreeks_id as lessenreeks_id`,
  "jaargang",
  "nummer",
  "startdatum",
  "einddatum",
];

// Lessenreeks(en) formateren

const formatLessenreeks = {
  lessenreeks_id: "lessenreeks_id",
  jaargang: "jaargang",
  nummer: "nummer",
  startdatum: "startdatum",
  einddatum: "einddatum",
};

// Alle lessenreeksen ophalen

const getAllLessenreeks = async () => {
  const lessenreeksen = await getKnex()(tables.lessenreeks)
    .select(SELECT_COLUMNS)
    .orderBy("lessenreeks_id", "ASC");
  return lessenreeksen.map((lessenreeks) =>
    ObjectMapper(lessenreeks, formatLessenreeks)
  );
};

// Lessenreeks ophalen a.d.h.v id

const getLessenreeksById = async (id) => {
  const lessenreeks = await getKnex()(tables.lessenreeks)
    .where("lessenreeks_id", id)
    .first(SELECT_COLUMNS);

  return ObjectMapper(lessenreeks, formatLessenreeks);
};

// Lessenreeks aanmaken

const createLessenreeks = async ({
  jaargang,
  nummer,
  startdatum,
  einddatum,
}) => {
  try {
    const [id] = await getKnex()(tables.lessenreeks).insert({
      jaargang,
      nummer,
      startdatum,
      einddatum,
    });
    return id;
  } catch (error) {
    getLogger().error("Error creating lessenreeks", {
      error,
    });
    throw error;
  }
};

// Lessenreeks updaten a.d.h.v id

const updateLessenreeksById = async (
  id,
  { jaargang, nummer, startdatum, einddatum }
) => {
  try {
    await getKnex()(tables.lessenreeks).where("lessenreeks_id", id).update({
      jaargang,
      nummer,
      startdatum,
      einddatum,
    });
  } catch (error) {
    getLogger().error("Error updating lessenreeks", {
      error,
    });
    throw error;
  }
};

// Lessenreeks verwijderen a.d.h.v id

const deleteLessenreeksById = async (id) => {
  try {
    await getKnex()(tables.lessenreeks).where("lessenreeks_id", id).del();
  } catch (error) {
    getLogger().error("Error deleting lessenreeks", {
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllLessenreeks,
  getLessenreeksById,
  createLessenreeks,
  updateLessenreeksById,
  deleteLessenreeksById,
};
