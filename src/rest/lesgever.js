const Joi = require("joi");
const Router = require("@koa/router");
const lesgeverService = require("../service/lesgever");
const validate = require("../core/validation");

const getAllLesgever = async (ctx) => {
  ctx.body = await lesgeverService.getAllLesgever();
};

getAllLesgever.validationScheme = null;

const createLesgever = async (ctx) => {
  const newLesgever = await lesgeverService.createLesgever({
    ...ctx.request.body,
    lesgever_id: Number(ctx.request.body.lesgever_id),
    naam: String(ctx.request.body.naam),
    geboortedatum: new Date(ctx.request.body.geboortedatum),
    type: String(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: String(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: Number(ctx.request.body.GSM),
    groep_id: Number(ctx.request.body.groep_id),
  });
  ctx.body = newLesgever;
};

createLesgever.validationScheme = {
  body: {
    lesgever_id: Joi.number().integer().positive(),
    naam: Joi.string(),
    geboortedatum: Joi.date().iso().less("now"),
    type: Joi.string(),
    aanwezigheidspercentage: Joi.number().integer().positive(),
    diploma: Joi.string(),
    imageURL: Joi.string(),
    email: Joi.string(),
    GSM: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
  },
};

const getLesgeverById = async (ctx) => {
  ctx.body = await lesgeverService.getLesgeverById(Number(ctx.params.id));
};

getLesgeverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateLesgeverById = async (ctx) => {
  ctx.body = await lesgeverService.updateLesgeverById(
    Number(ctx.params.lesgever_id),
    {
      ...ctx.request.body,
      lesgever_id: Number(ctx.request.body.lesgever_id),
      naam: String(ctx.request.body.naam),
      geboortedatum: new Date(ctx.request.body.date),
      type: String(ctx.request.body.type),
      aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
      diploma: String(ctx.request.body.diploma),
      imageURL: String(ctx.request.body.imageURL),
      email: String(ctx.request.body.email),
      GSM: Number(ctx.request.body.GSM),
      groep_id: Number(ctx.request.body.groep_id),
    }
  );
};

updateLesgeverById.validationScheme = {
  body: {
    lesgever_id: Joi.number().integer().positive(),
    naam: Joi.string(),
    geboortedatum: Joi.date().iso().less("now"),
    type: Joi.string(),
    aanwezigheidspercentage: Joi.number().integer().positive(),
    diploma: Joi.string(),
    imageURL: Joi.string(),
    email: Joi.string(),
    GSM: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
  },
};

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
