const Router = require("@koa/router");
const groepService = require("../service/groep");

const getAllGroepen = async (ctx) => {
  ctx.body = groepService.getAllGroepen();
};

const createGroep = async (ctx) => {
  const newGroep = groepService.createGroep({
    ...ctx.request.body,
    id: Number(ctx.request.body.placeId),
    naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
  ctx.body = newGroep;
};

const getGroepById = async (ctx) => {
  ctx.body = groepService.getGroepById(Number(ctx.params.id));
};

const updateGroepByID = async (ctx) => {
  ctx.body = groepService.updateGroepByID(Number(ctx.params.id), {
    ...ctx.request.body,
    id: Number(ctx.request.body.placeId),
    naam: String(ctx.request.body.naam),
    beschrijving: String(ctx.request.body.beschrijving),
    aantal_lesgevers: Number(ctx.request.body.aantal_lesgevers),
  });
};

const deleteGroepById = async (ctx) => {
  groepService.deleteGroepById(Number(ctx.params.id));
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/transactions",
  });

  router.get("/", getAllGroepen);
  router.post("/", createGroep);
  router.get("/:id", getGroepById);
  router.put("/:id", updateGroepByID);
  router.delete("/:id", deleteGroepById);

  app.use(router.routes()).use(router.allowedMethods());
};
