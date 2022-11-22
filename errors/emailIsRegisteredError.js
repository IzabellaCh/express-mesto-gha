class emailIsRegisteredError extends Error {
  constructor() {
    super();
    this.name = 'emailIsRegisteredError';
    this.statusCode = 409;
    this.message = 'Пользователь с таким email уже зарегистрирован';
  }
}

module.exports = emailIsRegisteredError;
