const lesvoorbereidingRepository = require("../repository/lesvoorbereiding");

const getAllLesvoorbereidingen = async () => {
  const items = await lesvoorbereidingRepository.getAllLesvoorbereidingen();
  return { items, count: items.length };
};

const getLesvoorbereidingById = async (lesvoorbereiding_id) => {
  const lesvoorbereiding =
    await lesvoorbereidingRepository.getLesvoorbereidingById(
      lesvoorbereiding_id
    );

  if (!lesvoorbereiding) {
    throw Error(
      `Er bestaat geen lesvoorbereiding met id ${lesvoorbereiding_id}!`,
      {
        lesvoorbereiding_id,
      }
    );
  }

  return lesvoorbereiding;
};

const updateLesvoorbereidingById = async (
  lesvoorbereiding_id,
  { link_to_pdf, feedback, les_id, groep_id }
) => {
  await lesvoorbereidingRepository.updateLesvoorbereidingById(
    lesvoorbereiding_id,
    { link_to_pdf, feedback, les_id, groep_id }
  );

  return getLesvoorbereidingById(lesvoorbereiding_id);
};

module.exports = {
  getAllLesvoorbereidingen,
  getLesvoorbereidingById,
  updateLesvoorbereidingById,
};
