const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const ResourceNotFoundError = require('../error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'При создании пользователя введены некорректные данные' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      if (id.length === 24) {
        throw new ResourceNotFoundError();
      } else {
        throw new RangeError('Некорректный id пользователя');
      }
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
