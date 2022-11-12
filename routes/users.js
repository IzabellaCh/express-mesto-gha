const user = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

user.get('/', getUsers);
user.get('/:userId', getUserById);
user.post('/', createUser);
user.patch('/me', updateProfile);
user.patch('/me/avatar', updateAvatar);

module.exports = user;
