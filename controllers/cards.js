const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');
const ResourceNotFoundError = require('../error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(StatusCodes.CREATED).send(card))
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
      throw new ResourceNotFoundError();
    })
    .populate(['owner', 'likes'])
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ResourceNotFoundError') {
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
      throw new ResourceNotFoundError();
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ResourceNotFoundError') {
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
      throw new ResourceNotFoundError();
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};
