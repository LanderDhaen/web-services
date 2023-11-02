const Router = require("@koa/router");
const lesgeverService = require("../service/lesgever");

const getAllLesgever = async (ctx) => {
  ctx.body = await lesgeverService.getAllLesgever();
};

const createLesgever = async (ctx) => {
  console.log(ctx.request.body);
  const newLesgever = lesgeverService.createLesgever({
    ...ctx.request.body,
    lesgever_id: Number(ctx.request.body.lesgever_id),
    naam: String(ctx.request.body.naam),
    groep: String(ctx.request.body.groep),
    geboortedatum: new Date(ctx.request.body.geboortedatum),
    type: String(ctx.request.body.type),
    aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
    diploma: String(ctx.request.body.diploma),
    imageURL: String(ctx.request.body.imageURL),
    email: String(ctx.request.body.email),
    GSM: Number(ctx.request.body.GSM),
    groep_id: Number(ctx.request.body.groep_id),
  });
  ctx.body = newLesgever;
};

const getLesgeverById = async (ctx) => {
  ctx.body = lesgeverService.getLesgeverById(Number(ctx.params.lesgever_id));
};

const updateLesgeverById = async (ctx) => {
  ctx.body = lesgeverService.updateLesgeverById(
    Number(ctx.params.lesgever_id),
    {
      ...ctx.request.body,
      lesgever_id: Number(ctx.request.body.lesgever_id),
      naam: String(ctx.request.body.naam),
      groep: String(ctx.request.body.groep),
      geboortedatum: new Date(ctx.request.body.date),
      type: String(ctx.request.body.type),
      aanwezigheidspercentage: Number(ctx.request.body.aanwezigheidspercentage),
      diploma: String(ctx.request.body.diploma),
      imageURL: String(ctx.request.body.imageURL),
      email: String(ctx.request.body.email),
      GSM: Number(ctx.request.body.GSM),
      groep_id: Number(ctx.request.body.groep_id),
    }
  );
};

const deleteLesgeverById = async (ctx) => {
  lesgeverService.deleteLesgeverById(Number(ctx.params.lesgever_id));
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
