
import { ApiError } from '../middleware/errorHandler.js';

// Validate email and password for registration and login routes. Ensures email is in a valid format and password is at least 6 characters long.
export function validateAuth(req, _res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');

  if (errors.length > 0) return next(new ApiError(errors.join(' '), 400));
  next();
}

