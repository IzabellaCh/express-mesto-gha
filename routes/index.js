const router = require('express').Router();
const auth = require('../middlewares/auth');
const user = require('./users');
const card = require('./cards');
const { login, createUser } = require('../controllers/users');
const PageNotFoundError = require('../errors/pageNotFoundError');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', user);
router.use('/cards', card);

router.use('/', (req, res, next) => {
  next(new PageNotFoundError());
});

module.exports = router;
