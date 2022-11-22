class ValidationError extends Error {
  constructor() {
    super();
    this.name = 'validationError';
    this.statusCode = 401;
    this.message = 'Введены некорректные данные';
  }
}

module.exports = ValidationError;
