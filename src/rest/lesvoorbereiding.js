const Joi = require("joi");
const Router = require("@koa/router");
const lesvoorbereidingService = require("../service/lesvoorbereiding");
const c = require("config");
const validate = require("../core/validation");

// Alle lesvoorbereidingen ophalen

const getAllLesvoorbereidingen = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getAllLesvoorbereidingen();
};

getAllLesvoorbereidingen.validationScheme = null;

// Lesvoorbereiding aanmaken

const createLesvoorbereiding = async (ctx) => {
  const newLesvoorbereiding =
    await lesvoorbereidingService.createLesvoorbereiding({
      ...ctx.request.body,
      lesvoorbereiding_naam: String(ctx.request.body.lesvoorbereiding_naam),
      lesvoorbereiding_type: String(ctx.request.body.lesvoorbereiding_type),
      link_to_PDF: String(ctx.request.body.link_to_PDF),
      feedback: String(ctx.request.body.feedback),
      les_id: Number(ctx.request.body.les_id),
      groep_id: Number(ctx.request.body.groep_id),
    });
  ctx.status = 201;
  ctx.body = newLesvoorbereiding;
};

createLesvoorbereiding.validationScheme = {
  body: {
    lesvoorbereiding_naam: Joi.string(),
    lesvoorbereiding_type: Joi.string(),
    link_to_PDF: Joi.string(),
    feedback: Joi.string(),
    les_id: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
  },
};

// Lesvoorbereiding ophalen a.d.h.v id

const getLesvoorbereidingById = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getLesvoorbereidingById(
    Number(ctx.params.id)
  );
};

getLesvoorbereidingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesvoorbereiding updaten a.d.h.v id

const updateLesvoorbereidingById = async (ctx) => {
  ctx.body = await lesvoorbereidingService.updateLesvoorbereidingById(
    Number(ctx.params.id),
    {
      ...ctx.request.body,
      lesvoorbereiding_naam: String(ctx.request.body.lesvoorbereiding_naam),
      lesvoorbereiding_type: String(ctx.request.body.lesvoorbereiding_type),
      link_to_PDF: String(ctx.request.body.link_to_PDF),
      feedback: String(ctx.request.body.feedback),
      les_id: Number(ctx.request.body.les_id),
      groep_id: Number(ctx.request.body.groep_id),
    }
  );
};

updateLesvoorbereidingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    lesvoorbereiding_naam: Joi.string(),
    lesvoorbereiding_type: Joi.string(),
    link_to_PDF: Joi.string(),
    feedback: Joi.string(),
    les_id: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
  },
};

// Lesvoorbereiding verwijderen a.d.h.v id

const deleteLesvoorbereidingById = async (ctx) => {
  await lesvoorbereidingService.deleteLesvoorbereidingById(
    Number(ctx.params.id)
  );
  ctx.status = 204;
};

deleteLesvoorbereidingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesvoorbereidingen",
  });

  router.get(
    "/",
    validate(getAllLesvoorbereidingen.validationScheme),
    getAllLesvoorbereidingen
  );
  router.post(
    "/",
    validate(createLesvoorbereiding.validationScheme),
    createLesvoorbereiding
  );
  router.get(
    "/:id",
    validate(getLesvoorbereidingById.validationScheme),
    getLesvoorbereidingById
  );
  router.put(
    "/:id",
    validate(updateLesvoorbereidingById.validationScheme),
    updateLesvoorbereidingById
  );
  router.delete(
    "/:id",
    validate(deleteLesvoorbereidingById.validationScheme),
    deleteLesvoorbereidingById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
