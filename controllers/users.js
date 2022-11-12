const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ReferenceError('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id пользователя' });
      } else if (err.name === 'ReferenceError') {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'При создании пользователя введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { runValidators: true })
    .orFail(() => {
      throw new ReferenceError('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(404).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { runValidators: true })
    .orFail(() => {
      throw new ReferenceError('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(404).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};
