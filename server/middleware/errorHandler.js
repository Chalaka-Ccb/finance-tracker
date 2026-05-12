// Gloal error handling middleware for Express. Catches errors thrown in route handlers and sends a JSON response with the error message and status code.


export function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err);

  const status  = err.statusCode || 500;
  const message = err.message    || 'Internal Server Error';

  res.status(status).json({ error: message });
}


export class ApiError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}