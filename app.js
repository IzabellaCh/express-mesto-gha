const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { PORT, mongoDB } = require('./constants');
const handleError = require('./middlewares/handleError');

const app = express();

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
