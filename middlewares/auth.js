const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

const { JWT_SECRET_DEV } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthorizationError();
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    throw new AuthorizationError();
  }

  req.user = payload;

  return next();
};

module.exports = auth;
