const Joi = require("joi");
const Router = require("@koa/router");
const lesService = require("../service/les");
const lesgeverschemaService = require("../service/lesgeverschema");
const validate = require("../core/validation");

// Alle lessen ophalen

const getAllLessen = async (ctx) => {
  ctx.body = await lesService.getAllLessen();
};

getAllLessen.validationScheme = null;

// Les aanmaken

const createLes = async (ctx) => {
  const newLes = await lesService.createLes({
    ...ctx.request.body,
    datum: new Date(ctx.request.body.datum),
    lessenreeks_id: Number(ctx.request.body.lessenreeks_id),
  });
  ctx.status = 201;
  ctx.body = newLes;
};

createLes.validationScheme = {
  body: {
    datum: Joi.date().iso().less("now"),
    lessenreeks_id: Joi.number().integer().positive(),
  },
};

// Les ophalen a.d.h.v id

const getLesById = async (ctx) => {
  ctx.body = await lesService.getLesById(Number(ctx.params.id));
};

getLesById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesgeverschema ophalen a.d.h.v. les_id

const getLesgeverschemaByLesId = async (ctx) => {
  ctx.body = await lesgeverschemaService.getLesgeverschemaByLesId(
    Number(ctx.params.id)
  );
};

getLesgeverschemaByLesId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Les updaten a.d.h.v id

const updateLesById = async (ctx) => {
  ctx.body = await lesService.updateLesById(Number(ctx.params.id), {
    ...ctx.request.body,
    datum: new Date(ctx.request.body.datum),
    lessenreeks_id: Number(ctx.request.body.lessenreeks_id),
  });
};

updateLesById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    datum: Joi.date().iso().less("now"),
    lessenreeks_id: Joi.number().integer().positive(),
  },
};

// Les verwijderen a.d.h.v id

const deleteLesById = async (ctx) => {
  ctx.body = await lesService.deleteLesById(Number(ctx.params.id));
};

deleteLesById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lessen",
  });

  router.get("/", validate(getAllLessen.validationScheme), getAllLessen);
  router.post("/", validate(createLes.validationScheme), createLes);
  router.get("/:id", validate(getLesById.validationScheme), getLesById);
  router.get(
    "/:id/lesgeverschemas",
    validate(getLesgeverschemaByLesId.validationScheme),
    getLesgeverschemaByLesId
  );
  router.put("/:id", validate(updateLesById.validationScheme), updateLesById);
  router.delete(
    "/:id",
    validate(deleteLesById.validationScheme),
    deleteLesById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
