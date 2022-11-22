class AuthorizationError extends Error {
  constructor() {
    super();
    this.name = 'AuthorizationError';
    this.statusCode = 401;
    this.message = 'Необходима авторизация';
  }
}

module.exports = AuthorizationError;
