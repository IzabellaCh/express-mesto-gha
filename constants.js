const {
  PORT = 3001,
  mongoDB = 'mongodb://localhost:27017/mestodb',
  JWT_SECRET_DEV = 'some-secret-key',
} = process.env;

const SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const INCORRECT_USER_ID_MESSAGE = 'Некорректный id пользователя';
const INCORRECT_DATA_MESSAGE = 'Введены некорректные данные';
const INCORRECT_CARD_ID_MESSAGE = 'Некорректный id карточки';
const PAGE_NOT_FOUND_MESSAGE = 'Страница по указанному маршруту не найдена';

module.exports = {
  SERVER_ERROR_MESSAGE,
  INCORRECT_USER_ID_MESSAGE,
  INCORRECT_DATA_MESSAGE,
  INCORRECT_CARD_ID_MESSAGE,
  PAGE_NOT_FOUND_MESSAGE,
  PORT,
  mongoDB,
  JWT_SECRET_DEV,
};
