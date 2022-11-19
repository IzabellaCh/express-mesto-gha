const user = require('express').Router();

const {
  getUsers,
  getUserById,
  getMyProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

user.get('/', getUsers);
user.get('/me', getMyProfile);
user.get('/:userId', getUserById);
user.patch('/me', updateProfile);
user.patch('/me/avatar', updateAvatar);

module.exports = user;
