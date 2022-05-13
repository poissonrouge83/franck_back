// const logger = require("../helpers/logger");
const jwt = require("express-jwt");

module.exports.jwtMiddleware = function (opts) {
  const baseJwtConfig = {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  };
  if (opts) {
    return jwt(opts);
  }
  return jwt(baseJwtConfig);
};
