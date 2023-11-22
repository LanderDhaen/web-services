const Joi = require("joi");
const Router = require("@koa/router");
const lesvoorbereidingService = require("../service/lesvoorbereiding");
const c = require("config");
const validate = require("../core/validation");

const getAllLesvoorbereidingen = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getAllLesvoorbereidingen();
};

getAllLesvoorbereidingen.validationScheme = null;

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

const updateLesvoorbereidingById = async (ctx) => {
  ctx.body = await lesvoorbereidingService.updateLesvoorbereidingById(
    Number(ctx.params.id),
    {
      ...ctx.request.body,
      lesvoorbereiding_naam: String(ctx.request.body.lesvoorbereiding_naam),
      lesvoorbereiding_type: String(ctx.request.body.lesvoorbereiding_type),
      link_to_PDF: String(ctx.request.body.link_to_pdf),
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

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesvoorbereidingen",
  });

  router.get(
    "/",
    validate(getAllLesvoorbereidingen.validationScheme),
    getAllLesvoorbereidingen
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

  app.use(router.routes()).use(router.allowedMethods());
};
