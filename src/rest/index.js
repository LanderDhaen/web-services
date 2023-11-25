const Router = require("@koa/router");
const installLesgeverRouter = require("./lesgever");
const installHealthRouter = require("./health");
const installGroepRouter = require("./groep");
const installLesvoorbereidingRouter = require("./lesvoorbereiding");
const installLessenreeksRouter = require("./lessenreeks");
const installLesRouter = require("./les");

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installLesgeverRouter(router);
  installHealthRouter(router);
  installGroepRouter(router);
  installLesvoorbereidingRouter(router);
  installLessenreeksRouter(router);
  installLesRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
