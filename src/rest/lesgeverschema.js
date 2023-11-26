const Joi = require("joi");
const Router = require("@koa/router");
const lesgeverschemaService = require("../service/lesgeverschema");
const validate = require("../core/validation");

// Alle lesgeverschema's ophalen

const getAllLesgeverschema = async (ctx) => {
  ctx.body = await lesgeverschemaService.getAllLesgeverschema();
};

getAllLesgeverschema.validationScheme = null;

// Lesgeverschema aanmaken

const createLesgeverschema = async (ctx) => {
  const newLesgeverschema = await lesgeverschemaService.createLesgeverschema({
    ...ctx.request.body,
    les_id: Number(ctx.request.body.les_id),
    groep_id: Number(ctx.request.body.groep_id),
    lesgever_id: Number(ctx.request.body.lesgever_id),
  });
  ctx.status = 201;
  ctx.body = newLesgeverschema;
};

createLesgeverschema.validationScheme = {
  body: {
    les_id: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
    lesgever_id: Joi.number().integer().positive(),
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

// Lesgeverschema verwijderen a.d.h.v. les_id

const deleteLesgeverschemaByLesId = async (ctx) => {
  ctx.body = await lesgeverschemaService.deleteLesgeverschemaByLesId(
    Number(ctx.params.id)
  );
};

deleteLesgeverschemaByLesId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesgeverschemas",
  });

  router.get(
    "/",
    validate(getAllLesgeverschema.validationScheme),
    getAllLesgeverschema
  );
  router.get(
    "/:id",
    validate(getLesgeverschemaByLesId.validationScheme),
    getLesgeverschemaByLesId
  );

  router.post(
    "/",
    validate(createLesgeverschema.validationScheme),
    createLesgeverschema
  );

  app.use(router.routes()).use(router.allowedMethods());
};
