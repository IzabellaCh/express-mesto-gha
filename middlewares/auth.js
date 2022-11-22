// const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(req.cookies);

  if (!token) {
    throw new AuthorizationError();
    // return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizationError();
    // return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
