class WrongEmailOrPasswordError extends Error {
  constructor() {
    super();
    this.name = 'WrongEmailOrPasswordError';
    this.statusCode = 401;
    this.message = 'Неправильные почта или пароль';
  }
}

module.exports = WrongEmailOrPasswordError;
