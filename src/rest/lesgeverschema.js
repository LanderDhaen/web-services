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
  console.log(ctx.params.id);
  ctx.body = await lesgeverschemaService.getLesgeverschemaByLesId(
    Number(ctx.params.id)
  );
};

getLesgeverschemaByLesId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// Lesgeverschema updaten a.d.h.v. id

const updateLesgeverschemaById = async (ctx) => {
  ctx.body = await lesgeverschemaService.updateLesgeverschemaById(
    Number(ctx.params.id),
    {
      ...ctx.request.body,
      les_id: Number(ctx.request.body.les_id),
      groep_id: Number(ctx.request.body.groep_id),
      lesgever_id: Number(ctx.request.body.lesgever_id),
    }
  );
};

updateLesgeverschemaById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    les_id: Joi.number().integer().positive(),
    lesgever_id: Joi.number().integer().positive(),
    groep_id: Joi.number().integer().positive(),
  },
};

// Lesgeverschema verwijderen a.d.h.v. id

const deleteLesgeverschemaById = async (ctx) => {
  ctx.body = await lesgeverschemaService.deleteLesgeverschemaById(
    Number(ctx.params.id)
  );
};

deleteLesgeverschemaById.validationScheme = {
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

  router.put(
    "/:id",
    validate(updateLesgeverschemaById.validationScheme),
    updateLesgeverschemaById
  );

  router.delete(
    "/:id",
    validate(deleteLesgeverschemaById.validationScheme),
    deleteLesgeverschemaById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
