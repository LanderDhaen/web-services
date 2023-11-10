const Router = require("@koa/router");
const lesvoorbereidingService = require("../service/lesvoorbereiding");
const c = require("config");

const getAllLesvoorbereidingen = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getAllLesvoorbereidingen();
};

const getLesvoorbereidingById = async (ctx) => {
  ctx.body = await lesvoorbereidingService.getLesvoorbereidingById(
    Number(ctx.params.lesvoorbereiding_id)
  );
};

const updateLesvoorbereidingById = async (ctx) => {
  ctx.body = await lesvoorbereidingService.updateLesvoorbereidingById(
    Number(ctx.params.lesvoorbereiding_id),
    {
      ...ctx.request.body,
      lesvoorbereiding_id: Number(ctx.request.body.lesvoorbereiding_id),
      link_to_pdf: String(ctx.request.body.link_to_pdf),
      feedback: String(ctx.request.body.feedback),
      les_id: Number(ctx.request.body.les_id),
      groep_id: Number(ctx.request.body.groep_id),
    }
  );
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/lesvoorbereidingen",
  });

  router.get("/", getAllLesvoorbereidingen);
  router.get("/:id", getLesvoorbereidingById);
  router.put("/:id", updateLesvoorbereidingById);

  app.use(router.routes()).use(router.allowedMethods());
};
