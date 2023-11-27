const { tables, getKnex } = require("../data/index");
const { getLogger } = require("../core/logging");
const ServiceError = require("../core/serviceError");
const ObjectMapper = require("object-mapper");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.lesgeverschema}.les_lesgever_id as les_lesgever_id`,
  `${tables.lesgeverschema}.groep_id as groep_id_schema`,
  `${tables.lesgever}.lesgever_id as lesgever_id`,
  `${tables.lesgever}.lesgever_naam as lesgever_naam`,
  `${tables.lesgever}.geboortedatum as geboortedatum`,
  `${tables.lesgever}.type as type`,
  `${tables.lesgever}.aanwezigheidspercentage as aanwezigheidspercentage`,
  `${tables.lesgever}.diploma as diploma`,
  `${tables.lesgever}.imageURL as imageURL`,
  `${tables.lesgever}.email as email`,
  `${tables.lesgever}.GSM as GSM`,
  `${tables.lesgever}.groep_id as groep_id`,
  `${tables.les}.les_id as les_id`,
  `${tables.les}.datum as datum`,
  `${tables.lessenreeks}.lessenreeks_id as lessenreeks_id`,
  `${tables.lessenreeks}.jaargang as jaargang`,
  `${tables.lessenreeks}.nummer as nummer`,
  `${tables.lessenreeks}.startdatum as startdatum`,
  `${tables.lessenreeks}.einddatum as einddatum`,
];

// Lesgeverschema(s) formatteren

const formatLesgeverschemas = (lesgeverschemas) => {
  return lesgeverschemas.reduce((result, current) => {
    const existingLes = result.find((les) => les.les_id === current.les_id);

    if (existingLes) {
      if (!existingLes.lessenreeks) {
        existingLes.lessenreeks = {
          lessenreeks_id: current.lessenreeks_id,
          jaargang: current.jaargang,
          nummer: current.nummer,
          startdatum: current.startdatum,
          einddatum: current.einddatum,
        };
      }

      const existingGroep = existingLes.groepen.find(
        (groep) => groep.groep_id_schema === current.groep_id_schema
      );

      if (existingGroep) {
        existingGroep.lesgevers.push({
          les_lesgever_id: current.les_lesgever_id,
          lesgever_id: current.lesgever_id,
          lesgever_naam: current.lesgever_naam,
          geboortedatum: current.geboortedatum,
          type: current.type,
          aanwezigheidspercentage: current.aanwezigheidspercentage,
          diploma: current.diploma,
          imageURL: current.imageURL,
          email: current.email,
          GSM: current.GSM,
          groep_id: current.groep_id,
        });
      } else {
        existingLes.groepen.push({
          groep_id_schema: current.groep_id_schema,
          lesgevers: [
            {
              les_lesgever_id: current.les_lesgever_id,
              lesgever_id: current.lesgever_id,
              lesgever_naam: current.lesgever_naam,
              geboortedatum: current.geboortedatum,
              type: current.type,
              aanwezigheidspercentage: current.aanwezigheidspercentage,
              diploma: current.diploma,
              imageURL: current.imageURL,
              email: current.email,
              GSM: current.GSM,
              groep_id: current.groep_id,
            },
          ],
        });
      }
    } else {
      result.push({
        les_id: current.les_id,
        datum: current.datum,
        lessenreeks: {
          lessenreeks_id: current.lessenreeks_id,
          jaargang: current.jaargang,
          nummer: current.nummer,
          startdatum: current.startdatum,
          einddatum: current.einddatum,
        },
        groepen: [
          {
            groep_id_schema: current.groep_id_schema,
            lesgevers: [
              {
                les_lesgever_id: current.les_lesgever_id,
                lesgever_id: current.lesgever_id,
                lesgever_naam: current.lesgever_naam,
                geboortedatum: current.geboortedatum,
                type: current.type,
                aanwezigheidspercentage: current.aanwezigheidspercentage,
                diploma: current.diploma,
                imageURL: current.imageURL,
                email: current.email,
                GSM: current.GSM,
                groep_id: current.groep_id,
              },
            ],
          },
        ],
      });
    }

    return result;
  }, []);
};

// Alle lesgeverschema's ophalen

const getAllLesgeverschema = async () => {
  const lesgeverschemas = await getKnex()(tables.lesgeverschema)
    .join(
      tables.lesgever,
      `${tables.lesgeverschema}.lesgever_id`,
      "=",
      `${tables.lesgever}.lesgever_id`
    )
    .join(
      tables.les,
      `${tables.lesgeverschema}.les_id`,
      "=",
      `${tables.les}.les_id`
    )
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .select(SELECT_COLUMNS)
    .orderBy(`${tables.les}.les_id`, "ASC");

  return formatLesgeverschemas(lesgeverschemas);
};

// Lesgeverschema ophalen a.d.h.v. id

const getLesgeverschemaById = async (id) => {
  const lesgeverschema = await getKnex()(tables.lesgeverschema)
    .join(
      tables.lesgever,
      `${tables.lesgeverschema}.lesgever_id`,
      "=",
      `${tables.lesgever}.lesgever_id`
    )
    .join(
      tables.les,
      `${tables.lesgeverschema}.les_id`,
      "=",
      `${tables.les}.les_id`
    )
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .select(SELECT_COLUMNS)
    .where(`${tables.lesgeverschema}.les_lesgever_id`, id)
    .orderBy(`${tables.les}.les_id`, "ASC")
    .first();

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met id ${id}!`,
      {
        id,
      }
    );
  }

  return formatLesgeverschemas([lesgeverschema])[0];
};

// Lesgeverschema ophalen a.d.h.v. les_id

const getLesgeverschemaByLesId = async (id) => {
  const lesgeverschemas = await getKnex()(tables.lesgeverschema)
    .join(
      tables.lesgever,
      `${tables.lesgeverschema}.lesgever_id`,
      "=",
      `${tables.lesgever}.lesgever_id`
    )
    .join(
      tables.les,
      `${tables.lesgeverschema}.les_id`,
      "=",
      `${tables.les}.les_id`
    )
    .join(
      tables.lessenreeks,
      `${tables.les}.lessenreeks_id`,
      "=",
      `${tables.lessenreeks}.lessenreeks_id`
    )
    .select(SELECT_COLUMNS)
    .where(`${tables.les}.les_id`, id)
    .orderBy(`${tables.les}.les_id`, "ASC");

  if (!lesgeverschemas) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met les_id ${id}!`,
      {
        id,
      }
    );
  }

  return formatLesgeverschemas(lesgeverschemas);
};

// Lesgeverschema aanmaken

const createLesgeverschema = async ({ groep_id, lesgever_id, les_id }) => {
  const [id] = await getKnex()(tables.lesgeverschema).insert({
    les_id,
    groep_id,
    lesgever_id,
  });

  return id;
};

// Lesgeverschema verwijderen a.d.h.v. id

const deleteLesgeverschemaById = async (id) => {
  const lesgeverschema = await getKnex()(tables.lesgeverschema)
    .where(`${tables.lesgeverschema}.les_lesgever_id`, id)
    .del();

  if (!lesgeverschema) {
    throw ServiceError.notFound(
      `Er bestaat geen lesgeverschema met ID ${id}!`,
      {
        id,
      }
    );
  }

  return lesgeverschema;
};

module.exports = {
  getAllLesgeverschema,
  getLesgeverschemaById,
  getLesgeverschemaByLesId,
  createLesgeverschema,
  deleteLesgeverschemaById,
};
