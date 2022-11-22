class EmailIsRegistered extends Error {
  constructor() {
    super();
    this.name = 'EmailIsRegistered';
    this.statusCode = 409;
    this.message = 'Пользователь с таким email уже зарегистрирован';
  }
}

module.exports = EmailIsRegistered;
