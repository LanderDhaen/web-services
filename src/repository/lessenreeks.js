const { getLogger } = require("../core/logging");
const { tables, getKnex } = require("../data/index");
const ServiceError = require("../core/serviceError");
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

  if (!lessenreeks) {
    throw ServiceError.notFound(`Lessenreeks met id ${id} niet gevonden`);
  }
  return ObjectMapper(lessenreeks, formatLessenreeks);
};

// Lessenreeks aanmaken

const createLessenreeks = async ({
  jaargang,
  nummer,
  startdatum,
  einddatum,
}) => {
  const [id] = await getKnex()(tables.lessenreeks).insert({
    jaargang,
    nummer,
    startdatum,
    einddatum,
  });

  return id;
};

// Lessenreeks updaten a.d.h.v id

const updateLessenreeksById = async (
  id,
  { jaargang, nummer, startdatum, einddatum }
) => {
  await getKnex()(tables.lessenreeks).where("lessenreeks_id", id).update({
    jaargang,
    nummer,
    startdatum,
    einddatum,
  });
};

// Lessenreeks verwijderen a.d.h.v id

const deleteLessenreeksById = async (id) => {
  try {
    await getKnex()(tables.lessenreeks).where("lessenreeks_id", id).del();
  } catch (error) {
    throw ServiceError.notFound(`Lessenreeks met id ${id} niet gevonden`);
  }
};

module.exports = {
  getAllLessenreeks,
  getLessenreeksById,
  createLessenreeks,
  updateLessenreeksById,
  deleteLessenreeksById,
};
