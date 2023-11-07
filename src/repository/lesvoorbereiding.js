const { tables, getKnex } = require("../data/index");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.lesvoorbereiding}.lesvoorbereiding_id as lesvoorbereiding_id`,
  "link_to_pdf",
  "feedback",
  `${tables.lesvoorbereiding}.les_id as les_id`,
  `${tables.lesvoorbereiding}.groep_id as groep_id`,
];

// Lesvoorbereiding(en) formateren

const formatLesvoorbereiding =
  (lesvoorbereidingen) =>
  ({ lesvoorbereiding_id, link_to_pdf, feedback, les_id, groep_id }) => {
    return {
      lesvoorbereiding_id,
      link_to_pdf,
      feedback,
      les_id,
      groep_id,
    };
  };

// Alle lesvoorbereidingen ophalen

const getAllLesvoorbereidingen = async () => {
  const lesvoorbereidingen = await getKnex()(tables.lesvoorbereiding)
    .select(SELECT_COLUMNS)
    .orderBy("groep_id", "ASC");
  return lesvoorbereidingen.map(formatLesvoorbereiding(lesvoorbereidingen));
};

// Lesvoorbereiding ophalen op id

const getLesvoorbereidingById = async (lesvoorbereiding_id) => {
  const lesvoorbereiding = await getKnex()(tables.lesvoorbereiding)
    .where("lesvoorbereiding_id", lesvoorbereiding_id)
    .first(SELECT_COLUMNS);

  return formatLesvoorbereiding(lesvoorbereiding);
};

// Lesvoorbereidinginformatie updaten

const updateLesvoorbereidingById = async (lesvoorbereiding_id) => {
  await getKnex()(tables.lesvoorbereiding)
    .where("lesvoorbereiding_id", lesvoorbereiding_id)
    .update({
      link_to_pdf,
      feedback,
      les_id,
      groep_id,
    });
};

module.exports = {
  getAllLesvoorbereidingen,
  getLesvoorbereidingById,
  updateLesvoorbereidingById,
};
