const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { PORT, mongoDB } = require('./constants');
const handleError = require('./middlewares/handleError');

const app = express();

// ограничение количества запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standartHeaders: true,
  legacyHeaders: true,
});
app.use(limiter);
// настройка http-заголовков
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(mongoDB);

app.use('/', router);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
