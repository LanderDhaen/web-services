const Joi = require("joi");
const Router = require("@koa/router");
const lessenreeksService = require("../service/lessenreeks");
const validate = require("../core/validation");

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

module.exports = (app) => {
  const router = new Router({
    prefix: "/lessenreeksen",
  });

  router.get(
    "/",
    validate(getAllLessenreeks.validationScheme),
    getAllLessenreeks
  );
  router.get(
    "/:id",
    validate(getLessenreeksById.validationScheme),
    getLessenreeksById
  );
  router.post(
    "/",
    validate(createLessenreeks.validationScheme),
    createLessenreeks
  );

  router.put(
    "/:id",
    validate(updateLessenreeksById.validationScheme),
    updateLessenreeksById
  );

  router.delete(
    "/:id",
    validate(deleteLessenreeksById.validationScheme),
    deleteLessenreeksById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
