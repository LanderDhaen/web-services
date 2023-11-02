const { getLogger } = require("../core/logging");
const { tables, getKnex } = require("../data/index");

// Kolommen selecteren

const SELECT_COLUMNS = [
  `${tables.groep}.groep_id as groep_id`,
  `${tables.groep}.naam as groep_naam`,
  "beschrijving",
  "aantal_lesgevers",
  "lesgever_id",
  `${tables.lesgever}.naam as lesgever_naam`,
  "groep",
  "geboortedatum",
  "type",
  "aanwezigheidspercentage",
  "diploma",
  "imageURL",
  "email",
  "GSM",
];

// Groep(en) formateren

const formatGroep = (groepen) => {
  const geformateerdeGroepen = [];
  const groepenMap = new Map();

  groepen.forEach((data) => {
    const {
      groep_id,
      groep_naam,
      beschrijving,
      aantal_lesgevers,
      lesgever_id,
      lesgever_naam,
      groep,
      geboortedatum,
      type,
      aanwezigheidspercentage,
      diploma,
      imageURL,
      email,
      GSM,
    } = data;

    if (groepenMap.has(groep_id)) {
      const groep = groepenMap.get(groep_id);
      groep.lesgevers.push({
        lesgever_id,
        lesgever_naam,
        geboortedatum,
        type,
        aanwezigheidspercentage,
        diploma,
        imageURL,
        email,
        GSM,
      });
    } else {
      const groep = {
        groep_id,
        groep_naam,
        beschrijving,
        aantal_lesgevers,
        lesgevers: [
          {
            lesgever_id,
            lesgever_naam,
            geboortedatum,
            type,
            aanwezigheidspercentage,
            diploma,
            imageURL,
            email,
            GSM,
          },
        ],
      };
      groepenMap.set(groep_id, groep);
    }
  });

  geformateerdeGroepen.push(...groepenMap.values());

  return geformateerdeGroepen;
};

// Alle groepen ophalen

const getAllGroepen = async () => {
  const groepen = await getKnex()(tables.groep)
    .join(
      tables.lesgever,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .select(SELECT_COLUMNS)
    .orderBy("groep_id", "ASC");
  return formatGroep(groepen);
};

// Groep ophalen a.d.h.v id

const getGroepById = async (id) => {
  const groep = await getKnex()(tables.groep)
    .join(
      tables.lesgever,
      `${tables.lesgever}.groep_id`,
      "=",
      `${tables.groep}.groep_id`
    )
    .where(`${tables.groep}.groep_id`, id)
    .first(SELECT_COLUMNS);

  return groep;
};

module.exports = {
  getAllGroepen,
  getGroepById,
};
