import { sendError } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  return sendError(res, `API route not found: ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier for ${err.path}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value entered for field: ${duplicateField}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Multer file upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Uploaded file exceeds the 5 MB size limit';
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('[Server Error]:', err);
  }

  return sendError(res, message, statusCode);
};
