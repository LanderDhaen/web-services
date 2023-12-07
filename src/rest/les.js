const Joi = require("joi");
const Router = require("@koa/router");
const lesService = require("../service/les");
const lesgeverschemaService = require("../service/lesgeverschema");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

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
    datum: Joi.date().iso(),
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
    datum: Joi.date().iso(),
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

// Rollen controleren

const requireAdmin = makeRequireRole(Role.STUURGROEP);

module.exports = (app) => {
  const router = new Router({
    prefix: "/lessen",
  });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllLessen.validationScheme),
    getAllLessen
  );
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createLes.validationScheme),
    createLes
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getLesById.validationScheme),
    getLesById
  );
  router.get(
    "/:id/lesgeverschemas",
    requireAuthentication,
    requireAdmin,
    validate(getLesgeverschemaByLesId.validationScheme),
    getLesgeverschemaByLesId
  );
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateLesById.validationScheme),
    updateLesById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteLesById.validationScheme),
    deleteLesById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
