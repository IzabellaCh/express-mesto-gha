const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'При создании карточки введены некорректные данные' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new ReferenceError('Такой карточки не существует');
    })
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ReferenceError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ReferenceError('Такой карточки не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ReferenceError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ReferenceError('Такой карточки не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ReferenceError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};
