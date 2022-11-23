class BadRequestError extends Error {
  constructor() {
    super();
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.message = 'Введены некорректные данные';
  }
}

module.exports = BadRequestError;
