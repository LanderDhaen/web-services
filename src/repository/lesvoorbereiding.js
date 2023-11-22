const { tables, getKnex } = require("../data/index");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.lesvoorbereiding}.lesvoorbereiding_id as lesvoorbereiding_id`,
  "lesvoorbereiding_naam",
  "lesvoorbereiding_type",
  "link_to_PDF",
  "feedback",
  `${tables.lesvoorbereiding}.les_id as les_id`,
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.groep_naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
];

// Lesvoorbereiding(en) formateren

const formatLesvoorbereiding = ({
  lesvoorbereiding_id,
  lesvoorbereiding_naam,
  lesvoorbereiding_type,
  link_to_PDF,
  feedback,
  les_id,
  groep_id,
  groep_naam,
  beschrijving,
  aantal_lesgevers,
}) => {
  return {
    lesvoorbereiding_id,
    lesvoorbereiding_naam,
    lesvoorbereiding_type,
    link_to_PDF,
    feedback,
    les_id,
    groep: {
      groep_id,
      groep_naam,
      beschrijving,
      aantal_lesgevers,
    },
  };
};

// Alle lesvoorbereidingen ophalen

const getAllLesvoorbereidingen = async () => {
  const lesvoorbereidingen = await getKnex()(tables.lesvoorbereiding)
    .join(
      tables.groep,
      `${tables.lesvoorbereiding}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .select(SELECT_COLUMNS)
    .orderBy(`${tables.lesvoorbereiding}.lesvoorbereiding_id`, "ASC");
  return lesvoorbereidingen.map(formatLesvoorbereiding);
};

// Lesvoorbereiding ophalen a.d.h.v id

const getLesvoorbereidingById = async (id) => {
  const lesvoorbereiding = await getKnex()(tables.lesvoorbereiding)
    .join(
      tables.groep,
      `${tables.lesvoorbereiding}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where("lesvoorbereiding_id", id)
    .first(SELECT_COLUMNS);

  return formatLesvoorbereiding(lesvoorbereiding);
};

// Lesvoorbereiding aanmaken

const createLesvoorbereiding = async ({
  lesvoorbereiding_naam,
  lesvoorbereiding_type,
  link_to_PDF,
  feedback,
  les_id,
  groep_id,
}) => {
  try {
    const [id] = await getKnex()(tables.lesvoorbereiding).insert({
      lesvoorbereiding_naam,
      lesvoorbereiding_type,
      link_to_PDF,
      feedback,
      les_id,
      groep_id,
    });
    return id;
  } catch (error) {
    throw handleDBError(error);
  }
};

// Lesvoorbereiding updaten a.d.h.v id

const updateLesvoorbereidingById = async (
  id,
  {
    lesvoorbereiding_naam,
    lesvoorbereiding_type,
    link_to_PDF,
    feedback,
    les_id,
    groep_id,
  }
) => {
  await getKnex()(tables.lesvoorbereiding)
    .where("lesvoorbereiding_id", id)
    .update({
      lesvoorbereiding_naam,
      lesvoorbereiding_type,
      link_to_PDF,
      feedback,
      les_id,
      groep_id,
    });
};

// Lesvoorbereiding verwijderen a.d.h.v id

const deleteLesvoorbereidingById = async (id) => {
  await getKnex()(tables.lesvoorbereiding)
    .where("lesvoorbereiding_id", id)
    .del();
};

module.exports = {
  getAllLesvoorbereidingen,
  getLesvoorbereidingById,
  createLesvoorbereiding,
  updateLesvoorbereidingById,
  deleteLesvoorbereidingById,
};
