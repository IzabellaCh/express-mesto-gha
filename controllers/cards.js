const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');
const ResourceNotFoundError = require('../errors/resourceNotFoundError');
const NotOwnerError = require('../errors/notOwnerError');
const CastError = require('../errors/castError');
// const ValidationError = require('../errors/validationError');
const BadRequestError = require('../errors/badRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
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
        next(new CastError());
      } else if (err.name === 'ResourceNotFoundError') {
        next(new ResourceNotFoundError());
      } else if (err.name === 'NotOwnerError') {
        next(new NotOwnerError());
      } else {
        next(err);
      }
    });
};

const updateLikeCard = (req, res, operator, next) => {
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
        next(new BadRequestError());
      } else if (err.name === 'ResourceNotFoundError') {
        next(new ResourceNotFoundError());
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  updateLikeCard(req, res, { $addToSet: { likes: req.user._id } }, next);
};

const removeLike = (req, res, next) => {
  updateLikeCard(req, res, { $pull: { likes: req.user._id } }, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
