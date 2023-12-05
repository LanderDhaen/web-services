const Joi = require("joi");
const Router = require("@koa/router");
const lesgeverService = require("../service/lesgever");
const lesgeverschemaService = require("../service/lesgeverschema");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

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
    GSM: String(ctx.request.body.GSM),
    groep_id: Number(ctx.request.body.groep_id),
    password: String(ctx.request.body.password),
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
    GSM: Joi.string().length(10),
    groep_id: Joi.number().integer().positive(),
    password: Joi.string().min(1).required(),
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

// Lesgeverschema ophalen a.d.h.v. lesgever_id

const getLesgeverschemaByLesgeverId = async (ctx) => {
  ctx.body = await lesgeverschemaService.getLesgeverschemaByLesgeverId(
    Number(ctx.params.id)
  );
};

getLesgeverschemaByLesgeverId.validationScheme = {
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

// Lesgever inloggen

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await lesgeverService.login(email, password);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

// Controleren van de lesgever via id

const checkLesgeverId = (ctx, next) => {
  const { lesgever_id, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== lesgever_id && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

const requireAdmin = makeRequireRole(Role.STUURGROEP);

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesgevers",
  });

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllLesgever.validationScheme),
    getAllLesgever
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createLesgever.validationScheme),
    createLesgever
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getLesgeverById.validationScheme),
    getLesgeverById
  );
  router.get(
    "/:id/lesgeverschemas",
    requireAuthentication,
    validate(getLesgeverschemaByLesgeverId.validationScheme),
    getLesgeverschemaByLesgeverId
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateLesgeverById.validationScheme),
    checkLesgeverId,
    updateLesgeverById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteLesgeverById.validationScheme),
    deleteLesgeverById
  );

  // Publieke routes

  router.post("/login", validate(login.validationScheme), login);

  app.use(router.routes()).use(router.allowedMethods());
};
