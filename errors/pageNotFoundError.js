class PageNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'PageNotFoundError';
    this.statusCode = 404;
    this.message = 'Страница по указанному маршруту не найдена';
  }
}

module.exports = PageNotFoundError;
