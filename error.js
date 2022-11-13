class ResourceNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'ResourceNotFoundError';
    this.statusCode = 404;
    this.message = 'Ресурс не найден';
  }
}

module.exports = ResourceNotFoundError;
