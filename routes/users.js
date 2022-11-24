const user = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getMyProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

user.get('/', getUsers);
user.get('/me', getMyProfile);
user.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUserById);
user.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
user.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/\S+\.\S+/),
  }),
}), updateAvatar);

module.exports = user;
