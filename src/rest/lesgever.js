const Joi = require("joi");
const Router = require("@koa/router");
const lesgeverService = require("../service/lesgever");
const validate = require("../core/validation");

// Alle lesgevers ophalen

const getAllLesgever = async (ctx) => {
  ctx.body = await lesgeverService.getAllLesgever();
};

getAllLesgever.validationScheme = null;

// Lesgever aanmaken

const createLesgever = async (ctx) => {
  const newLesgever = await lesgeverService.createLesgever({
    ...ctx.request.body,
    lesgever_naam: String(ctx.request.body.lesgever_naam),
    geboortedatum: new Date(ctx.request.body.geboortedatum),
    type: String(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: String(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: Number(ctx.request.body.GSM),
    groep_id: Number(ctx.request.body.groep_id),
  });
  ctx.status = 201;
  ctx.body = newLesgever;
};

createLesgever.validationScheme = {
  body: {
    lesgever_naam: Joi.string(),
    geboortedatum: Joi.date().iso().less("now"),
    type: Joi.string(),
    aanwezigheidspercentage: Joi.number().integer().positive().min(0).max(100),
    diploma: Joi.string(),
    imageURL: Joi.string(),
    email: Joi.string().email(),
    GSM: Joi.number().integer().positive().precision(10),
    groep_id: Joi.number().integer().positive(),
  },
};

// Lesgever ophalen a.d.h.v id

const getLesgeverById = async (ctx) => {
  ctx.body = await lesgeverService.getLesgeverById(Number(ctx.params.id));
};

getLesgeverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesgever updaten a.d.h.v id

const updateLesgeverById = async (ctx) => {
  ctx.body = await lesgeverService.updateLesgeverById(Number(ctx.params.id), {
    ...ctx.request.body,
    lesgever_naam: String(ctx.request.body.lesgever_naam),
    geboortedatum: new Date(ctx.request.body.geboortedatum),
    type: String(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: String(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: String(ctx.request.body.GSM),
    groep_id: Number(ctx.request.body.groep_id),
  });
};

updateLesgeverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    lesgever_naam: Joi.string(),
    geboortedatum: Joi.date().iso().less("now"),
    type: Joi.string(),
    aanwezigheidspercentage: Joi.number().integer().positive().min(0).max(100),
    diploma: Joi.string(),
    imageURL: Joi.string(),
    email: Joi.string().email(),
    GSM: Joi.string().length(10),
    groep_id: Joi.number().integer().positive(),
  },
};

// Lesgever verwijderen a.d.h.v id

const deleteLesgeverById = async (ctx) => {
  await lesgeverService.deleteLesgeverById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteLesgeverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesgevers",
  });

  router.get("/", validate(getAllLesgever.validationScheme), getAllLesgever);
  router.post("/", validate(createLesgever.validationScheme), createLesgever);
  router.get(
    "/:id",
    validate(getLesgeverById.validationScheme),
    getLesgeverById
  );
  router.put(
    "/:id",
    validate(updateLesgeverById.validationScheme),
    updateLesgeverById
  );
  router.delete(
    "/:id",
    validate(deleteLesgeverById.validationScheme),
    deleteLesgeverById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
