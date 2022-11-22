class NotOwnerError extends Error {
  constructor() {
    super();
    this.name = 'NotOwnerError';
    this.statusCode = 400;
    this.message = 'Только создатель карточки может ее удалить';
  }
}

module.exports = NotOwnerError;
