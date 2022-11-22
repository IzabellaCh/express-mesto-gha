class EmailIsRegisteredError extends Error {
  constructor() {
    super();
    this.name = 'EmailIsRegisteredError';
    this.statusCode = 409;
    this.message = 'Пользователь с таким email уже зарегистрирован';
  }
}

module.exports = EmailIsRegisteredError;
