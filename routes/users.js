const user = require('express').Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

user.get('/', getUsers);
user.get('/:userId', getUserId);
user.post('/', createUser);
user.patch('/me', updateProfile);
user.patch('/me/avatar', updateAvatar);

module.exports = user;
