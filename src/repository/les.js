const { tables, getKnex } = require("../data/index");
const { getLogger } = require("../core/logging");
const ObjectMapper = require("object-mapper");

// Kolommen selecteren

const SELECT_COLUMNS = [
  "les_id",
  "datum",
  `${tables.lessenreeks}.lessenreeks_id as lessenreeks_id`,
  `${tables.lessenreeks}.jaargang as jaargang`,
  `${tables.lessenreeks}.nummer as nummer`,
  `${tables.lessenreeks}.startdatum as startdatum`,
  `${tables.lessenreeks}.einddatum as einddatum`,
];

// Les(sen) formatteren

const formatLes = {
  les_id: "les_id",
  datum: "datum",
  lessenreeks_id: "lessenreeks.lessenreeks_id",
  jaargang: "lessenreeks.jaargang",
  nummer: "lessenreeks.nummer",
  startdatum: "lessenreeks.startdatum",
  einddatum: "lessenreeks.einddatum",
};

// Alle lessen ophalen

const getAllLessen = async () => {
  const lessen = await getKnex()(tables.les)
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .select(SELECT_COLUMNS)
    .orderBy("les_id", "ASC");

  return lessen.map((les) => ObjectMapper(les, formatLes));
};

// Les ophalen a.d.h.v id

const getLesById = async (id) => {
  const les = await getKnex()(tables.les)
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .where("les_id", id)
    .first(SELECT_COLUMNS);

  return ObjectMapper(les, formatLes);
};

// Lessen ophalen a.d.h.v lessenreeks_id

const getLesByLessenreeksId = async (id) => {
  const lessen = await getKnex()(tables.les)
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .where(`${tables.les}.lessenreeks_id`, id)
    .select(SELECT_COLUMNS);

  return lessen.map((les) => ObjectMapper(les, formatLes));
};

// Les aanmaken

const createLes = async ({ datum, lessenreeks_id }) => {
  const [id] = await getKnex()(tables.les).insert({
    datum,
    lessenreeks_id,
  });

  return id;
};

// Les updaten a.d.h.v id

const updateLesById = async (id, { datum, lessenreeks_id }) => {
  await getKnex()(tables.les).where("les_id", id).update({
    datum,
    lessenreeks_id,
  });
};

// Les verwijderen a.d.h.v id

const deleteLesById = async (id) => {
  await getKnex()(tables.les).where("les_id", id).del();
};

module.exports = {
  getAllLessen,
  getLesById,
  getLesByLessenreeksId,
  createLes,
  updateLesById,
  deleteLesById,
};
