const Router = require("@koa/router");
const lesgeverService = require("../service/lesgever");

const getAllLesgever = async (ctx) => {
  ctx.body = lesgeverService.getAllLesgever();
};

const createLesgever = async (ctx) => {
  const newLesgever = lesgeverService.createLesgever({
    ...ctx.request.body,
    id: Number(ctx.request.body.placeId),
    naam: String(ctx.request.body.naam),
    groep: Number(ctx.request.body.groep),
    geboortedatum: new Date(ctx.request.body.date),
    type: Number(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: Number(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: Number(ctx.request.body.GSM),
  });
  ctx.body = newLesgever;
};

const getLesgeverById = async (ctx) => {
  ctx.body = lesgeverService.getLesgeverById(Number(ctx.params.id));
};

const updateLesgeverById = async (ctx) => {
  ctx.body = lesgeverService.updateLesgeverById(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.placeId),
    naam: String(ctx.request.body.naam),
    groep: Number(ctx.request.body.groep),
    geboortedatum: new Date(ctx.request.body.date),
    type: Number(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: Number(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: Number(ctx.request.body.GSM),
  });
};

const deleteLesgeverById = async (ctx) => {
  lesgeverService.deleteLesgeverById(Number(ctx.params.id));
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesgevers",
  });

  router.get("/", getAllLesgever);
  router.post("/", createLesgever);
  router.get("/:id", getLesgeverById);
  router.put("/:id", updateLesgeverById);
  router.delete("/:id", deleteLesgeverById);

  app.use(router.routes()).use(router.allowedMethods());
};
