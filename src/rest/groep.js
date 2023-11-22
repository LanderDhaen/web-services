const Joi = require("joi");
const Router = require("@koa/router");
const groepService = require("../service/groep");
const lesgeverService = require("../service/lesgever");
const validate = require("../core/validation");

const getAllGroepen = async (ctx) => {
  ctx.body = await groepService.getAllGroepen();
};

getAllGroepen.validationScheme = null;

const createGroep = async (ctx) => {
  const newGroep = await groepService.createGroep({
    ...ctx.request.body,
    groep_naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
  ctx.body = newGroep;
};

createGroep.validationScheme = {
  body: {
    groep_naam: Joi.string(),
    beschrijving: Joi.string(),
    aantal_lesgevers: Joi.number().integer().positive(),
  },
};

const getGroepById = async (ctx) => {
  ctx.body = await groepService.getGroepById(Number(ctx.params.id));
};

getGroepById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getLesgeverByGroepId = async (ctx) => {
  ctx.body = await lesgeverService.getLesgeverByGroepId(Number(ctx.params.id));
};

getLesgeverByGroepId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateGroepById = async (ctx) => {
  ctx.body = await groepService.updateGroepById(Number(ctx.params.groep_id), {
    ...ctx.request.body,
    groep_naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
};

updateGroepById.validationScheme = {
  params: {
    groep_id: Joi.number().integer().positive(),
  },
  body: {
    groep_naam: Joi.string(),
    beschrijving: Joi.string(),
    aantal_lesgevers: Joi.number().integer().positive(),
  },
};

const deleteGroepById = async (ctx) => {
  groepService.deleteGroepById(Number(ctx.params.groep_id));
  ctx.status = 204;
};

deleteGroepById.validationScheme = {
  params: {
    groep_id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/groepen",
  });

  router.get("/", validate(getAllGroepen.validationScheme), getAllGroepen);
  router.post("/", validate(createGroep.validationScheme), createGroep);
  router.get("/:id", validate(getGroepById.validationScheme), getGroepById);
  router.get(
    "/:id/lesgevers",
    validate(getLesgeverByGroepId.validationScheme),
    getLesgeverByGroepId
  );
  router.put(
    "/:id",
    validate(updateGroepById.validationScheme),
    updateGroepById
  );
  router.delete(
    "/:id",
    validate(deleteGroepById.validationScheme),
    deleteGroepById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
