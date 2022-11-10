const card = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

card.get('/', getCards);
card.post('/', createCard);
card.delete('/:cardId', deleteCard);
card.put('/:cardId/likes', likeCard);
card.delete('/:cardId/likes', dislikeCard);

module.exports = card;
