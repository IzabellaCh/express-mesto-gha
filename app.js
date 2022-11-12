const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/users');
const card = require('./routes/cards');

const { PORT = 3000, mongoDB = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoDB);

app.use((req, res, next) => {
  req.user = {
    _id: '636cab7359d319f9a8a6e6a0',
  };

  next();
});

app.use('/users', user);
app.use('/cards', card);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
