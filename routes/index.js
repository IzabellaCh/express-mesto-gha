const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const auth = require('../middlewares/auth');
const user = require('./users');
const card = require('./cards');
const { login, createUser } = require('../controllers/users');
const { PAGE_NOT_FOUND_MESSAGE } = require('../constants');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', user);
router.use('/cards', card);

router.use('/', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: PAGE_NOT_FOUND_MESSAGE });
});

module.exports = router;
