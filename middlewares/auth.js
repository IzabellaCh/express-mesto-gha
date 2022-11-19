const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
