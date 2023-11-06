const Router = require("@koa/router");
const installLesgeverRouter = require("./lesgever");
const installHealthRouter = require("./health");
const installGroepRouter = require("./groep");
const installLesvoorbereidingRouter = require("./lesvoorbereiding");

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installLesgeverRouter(router);
  installHealthRouter(router);
  installGroepRouter(router);
  installLesvoorbereidingRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
