const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ResourceNotFoundError = require('../error');
const {
  SERVER_ERROR_MESSAGE,
  INCORRECT_USER_ID_MESSAGE,
  INCORRECT_DATA_MESSAGE,
} = require('../constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: SERVER_ERROR_MESSAGE }));
};

// общая фукнция, испльзуется в 2х контроллерах: getUserById, getMyProfile
const findUserById = (req, res, id) => {
  User.findById(id)
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_USER_ID_MESSAGE });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const getUserById = (req, res) => {
  findUserById(req, res, req.params.userId);
};

const getMyProfile = (req, res) => {
  findUserById(req, res, req.user._id);
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const updateProfile = (req, res) => {
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
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_USER_ID_MESSAGE });
      } else if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_USER_ID_MESSAGE });
      } else if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Вы успешно авторизовались' });
    })
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyProfile,
};
