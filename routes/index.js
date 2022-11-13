const router = require('express').Router();
const user = require('./users');
const card = require('./cards');

router.use('/users', user);
router.use('/cards', card);
router.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

module.exports = router;
