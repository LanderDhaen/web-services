const Joi = require("joi");
const Router = require("@koa/router");
const lesgeverschemaService = require("../service/lesgeverschema");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

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

// Rollen controleren

const requireAdmin = makeRequireRole(Role.STUURGROEP);

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesgeverschemas",
  });

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllLesgeverschema.validationScheme),
    getAllLesgeverschema
  );

  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createLesgeverschema.validationScheme),
    createLesgeverschema
  );

  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateLesgeverschemaById.validationScheme),
    updateLesgeverschemaById
  );

  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteLesgeverschemaById.validationScheme),
    deleteLesgeverschemaById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
