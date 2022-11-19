const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000, mongoDB = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(mongoDB);

app.use('/', router);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
