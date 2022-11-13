const { StatusCodes } = require('http-status-codes');
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

const getUserById = (req, res) => {
  User.findById(req.params.userId)
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
