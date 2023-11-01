const Router = require("@koa/router");
const groepService = require("../service/groep");

const getAllGroepen = async (ctx) => {
  ctx.body = await groepService.getAllGroepen();
};

const createGroep = async (ctx) => {
  const newGroep = groepService.createGroep({
    ...ctx.request.body,
    groep_id: Number(ctx.request.body.groep_id),
    naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
  ctx.body = newGroep;
};

const getGroepById = async (ctx) => {
  ctx.body = groepService.getGroepById(Number(ctx.params.groep_id));
};

const updateGroepByID = async (ctx) => {
  ctx.body = groepService.updateGroepByID(Number(ctx.params.groep_id), {
    ...ctx.request.body,
    groep_id: Number(ctx.request.body.groep_id),
    naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
};

const deleteGroepById = async (ctx) => {
  groepService.deleteGroepById(Number(ctx.params.groep_id));
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/groepen",
  });

  router.get("/", getAllGroepen);
  router.post("/", createGroep);
  router.get("/:id", getGroepById);
  router.put("/:id", updateGroepByID);
  router.delete("/:id", deleteGroepById);

  app.use(router.routes()).use(router.allowedMethods());
};
