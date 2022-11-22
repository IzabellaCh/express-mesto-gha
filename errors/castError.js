class CastError extends Error {
  constructor() {
    super();
    this.name = 'CastError';
    this.statusCode = 401;
    this.message = 'Некорректный id';
  }
}

module.exports = CastError;
