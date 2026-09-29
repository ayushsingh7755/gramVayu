import { AppError } from '../utils/AppError.js';

export const requireFields = (fields = []) => {
  return (req, res, next) => {
    const missing = fields.filter(
      (field) =>
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ''
    );
    if (missing.length > 0) {
      return next(
        new AppError(`Missing required fields: ${missing.join(', ')}`, 400)
      );
    }
    next();
  };
};
