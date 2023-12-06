const Joi = require("joi");
const Router = require("@koa/router");
const lessenreeksService = require("../service/lessenreeks");
const lesService = require("../service/les");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

// Alle lessenreeksen ophalen

const getAllLessenreeks = async (ctx) => {
  ctx.body = await lessenreeksService.getAllLessenreeks();
};

getAllLessenreeks.validationScheme = null;

// Lessenreeks aanmaken

const createLessenreeks = async (ctx) => {
  const newLessenreeks = await lessenreeksService.createLessenreeks({
    ...ctx.request.body,
    jaargang: String(ctx.request.body.jaargang),
    nummer: Number(ctx.request.body.nummer),
    startdatum: new Date(ctx.request.body.startdatum),
    einddatum: new Date(ctx.request.body.einddatum),
  });
  ctx.status = 201;
  ctx.body = newLessenreeks;
};

createLessenreeks.validationScheme = {
  body: {
    jaargang: Joi.string().length(9),
    nummer: Joi.number().integer().positive().min(1).max(2),
    startdatum: Joi.date().iso().less("now"),
    einddatum: Joi.date().iso().less("now"),
  },
};

// Lessenreeks ophalen a.d.h.v id

const getLessenreeksById = async (ctx) => {
  ctx.body = await lessenreeksService.getLessenreeksById(Number(ctx.params.id));
};

getLessenreeksById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lessen ophalen a.d.h.v lessenreeks_id

const getLesByLessenreeksId = async (ctx) => {
  ctx.body = await lesService.getLesByLessenreeksId(Number(ctx.params.id));
};

getLesByLessenreeksId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lessenreeks updaten a.d.h.v id

const updateLessenreeksById = async (ctx) => {
  ctx.body = await lessenreeksService.updateLessenreeksById(
    Number(ctx.params.id),
    {
      ...ctx.request.body,
      jaargang: String(ctx.request.body.jaargang),
      nummer: Number(ctx.request.body.nummer),
      startdatum: new Date(ctx.request.body.startdatum),
      einddatum: new Date(ctx.request.body.einddatum),
    }
  );
};

updateLessenreeksById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    jaargang: Joi.string().length(9),
    nummer: Joi.number().integer().positive().min(1).max(2),
    startdatum: Joi.date().iso().less("now"),
    einddatum: Joi.date().iso().less("now"),
  },
};

// Lessenreeks verwijderen a.d.h.v id

const deleteLessenreeksById = async (ctx) => {
  ctx.body = await lessenreeksService.deleteLessenreeksById(
    Number(ctx.params.id)
  );
};

deleteLessenreeksById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Rollen controleren

const requireAdmin = makeRequireRole(Role.STUURGROEP);

module.exports = (app) => {
  const router = new Router({
    prefix: "/lessenreeksen",
  });

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllLessenreeks.validationScheme),
    getAllLessenreeks
  );
  router.get(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(getLessenreeksById.validationScheme),
    getLessenreeksById
  );
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createLessenreeks.validationScheme),
    createLessenreeks
  );

  router.get(
    "/:id/lessen",
    requireAuthentication,
    requireAdmin,
    validate(getLesByLessenreeksId.validationScheme),
    getLesByLessenreeksId
  );

  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateLessenreeksById.validationScheme),
    updateLessenreeksById
  );

  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteLessenreeksById.validationScheme),
    deleteLessenreeksById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
