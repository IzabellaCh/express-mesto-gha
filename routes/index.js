const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const user = require('./users');
const card = require('./cards');
const { login, createUser } = require('../controllers/users');
const PageNotFoundError = require('../errors/pageNotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/users', user);
router.use('/cards', card);

router.use('/', (req, res, next) => {
  next(new PageNotFoundError());
});

module.exports = router;
