const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

const { JWT_SECRET = 'some-secret-key' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthorizationError();
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError();
  }

  req.user = payload;

  return next();
};

module.exports = auth;
