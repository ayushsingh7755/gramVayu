import { sendError } from '../utils/apiResponse.js';

const requestCounts = new Map();

export const rateLimiter = ({ windowMs = 60 * 1000, max = 250 } = {}) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now - record.startTime > windowMs) {
      requestCounts.set(ip, { count: 1, startTime: now });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      return sendError(
        res,
        'Too many requests from this IP, please try again after a minute.',
        429
      );
    }

    next();
  };
};
