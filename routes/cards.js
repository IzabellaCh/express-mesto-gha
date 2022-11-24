const card = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

card.get('/', getCards);
card.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/\S+\.\S+/),
  }),
}), createCard);
card.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), deleteCard);
card.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), setLike);
card.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), removeLike);

module.exports = card;
