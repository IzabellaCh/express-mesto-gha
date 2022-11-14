const card = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

card.get('/', getCards);
card.post('/', createCard);
card.delete('/:cardId', deleteCard);
card.put('/:cardId/likes', setLike);
card.delete('/:cardId/likes', removeLike);

module.exports = card;
