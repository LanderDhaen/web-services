const Joi = require("joi");
const Router = require("@koa/router");
const groepService = require("../service/groep");
const lesgeverService = require("../service/lesgever");
const lesvoorbereidingService = require("../service/lesvoorbereiding");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

// Alle groepen ophalen

const getAllGroepen = async (ctx) => {
  ctx.body = await groepService.getAllGroepen();
};

getAllGroepen.validationScheme = null;

// Groep aanmaken

const createGroep = async (ctx) => {
  const newGroep = await groepService.createGroep({
    ...ctx.request.body,
    groep_naam: String(ctx.request.body.groep_naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
  ctx.status = 201;
  ctx.body = newGroep;
};

createGroep.validationScheme = {
  body: {
    groep_naam: Joi.string(),
    beschrijving: Joi.string(),
    aantal_lesgevers: Joi.number().integer().positive(),
  },
};

// Groep ophalen a.d.h.v id

const getGroepById = async (ctx) => {
  ctx.body = await groepService.getGroepById(Number(ctx.params.id));
};

getGroepById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesgevers ophalen a.d.h.v groep_id

const getLesgeverByGroepId = async (ctx) => {
  ctx.body = await lesgeverService.getLesgeverByGroepId(Number(ctx.params.id));
};

getLesgeverByGroepId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesvoorbereidingen ophalen a.d.h.v groep_id

const getLesvoorbereidingByGroepId = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getLesvoorbereidingByGroepId(
    Number(ctx.params.id)
  );
};

getLesvoorbereidingByGroepId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Groep updaten a.d.h.v id

const updateGroepById = async (ctx) => {
  ctx.body = await groepService.updateGroepById(Number(ctx.params.id), {
    ...ctx.request.body,
    groep_naam: String(ctx.request.body.groep_naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
};

updateGroepById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    groep_naam: Joi.string(),
    beschrijving: Joi.string(),
    aantal_lesgevers: Joi.number().integer().positive(),
  },
};

// Groep verwijderen a.d.h.v id

const deleteGroepById = async (ctx) => {
  groepService.deleteGroepById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteGroepById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const requireAdmin = makeRequireRole(Role.STUURGROEP);

module.exports = (app) => {
  const router = new Router({
    prefix: "/groepen",
  });

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllGroepen.validationScheme),
    getAllGroepen
  );
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createGroep.validationScheme),
    createGroep
  );
  router.get(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(getGroepById.validationScheme),
    getGroepById
  );
  router.get(
    "/:id/lesgevers",
    requireAuthentication,
    requireAdmin,
    validate(getLesgeverByGroepId.validationScheme),
    getLesgeverByGroepId
  );
  router.get(
    "/:id/lesvoorbereidingen",
    requireAuthentication,
    requireAdmin,
    validate(getLesvoorbereidingByGroepId.validationScheme),
    getLesvoorbereidingByGroepId
  );
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateGroepById.validationScheme),
    updateGroepById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteGroepById.validationScheme),
    deleteGroepById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
