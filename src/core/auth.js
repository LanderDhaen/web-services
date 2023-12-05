const lesgeverService = require("../service/lesgever");

const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await lesgeverService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
};

const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session;

  lesgeverService.checkRole(role, roles);
  return next();
};

module.exports = {
  requireAuthentication,
  makeRequireRole,
};
