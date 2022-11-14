const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');
const ResourceNotFoundError = require('../error');
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
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then(() => res.send({ message: 'Пост удален' }))
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

// const likeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new ResourceNotFoundError();
//     })
//     .populate(['owner', 'likes'])
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_CARD_ID_MESSAGE });
//       } else if (err.name === 'ResourceNotFoundError') {
//         res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
//       } else {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
//       }
//     });
// };

// const dislikeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new ResourceNotFoundError();
//     })
//     .populate(['owner', 'likes'])
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(StatusCodes.BAD_REQUEST).send({ message: INCORRECT_CARD_ID_MESSAGE });
//       } else if (err.name === 'ResourceNotFoundError') {
//         res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
//       } else {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
//       }
//     });
// };

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
