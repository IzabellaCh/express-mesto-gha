const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routes/users');
const card = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '636cab7359d319f9a8a6e6a0',
  };

  next();
});

app.use('/users', user);
app.use('/cards', card);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
