const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');
const ResourceNotFoundError = require('../errors/error');
const NotOwnerError = require('../errors/notOwnerError');
const {
  SERVER_ERROR_MESSAGE,
  INCORRECT_DATA_MESSAGE,
  INCORRECT_CARD_ID_MESSAGE,
} = require('../constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: SERVER_ERROR_MESSAGE }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((card) => {
      const owner = card.owner._id.toString();
      const userId = req.user._id;
      if (owner !== userId) {
        throw new NotOwnerError();
      }
      Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Пост удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_CARD_ID_MESSAGE });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === 'NotOwnerError') {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const updateLikeCard = (req, res, operator) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    operator,
    { new: true },
  )
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_CARD_ID_MESSAGE });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const setLike = (req, res) => {
  updateLikeCard(req, res, { $addToSet: { likes: req.user._id } });
};

const removeLike = (req, res) => {
  updateLikeCard(req, res, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
