const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const user = require('./users');
const card = require('./cards');
const { PAGE_NOT_FOUND_MESSAGE } = require('../constants');

router.use('/users', user);
router.use('/cards', card);
router.use('/', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: PAGE_NOT_FOUND_MESSAGE });
});

module.exports = router;
