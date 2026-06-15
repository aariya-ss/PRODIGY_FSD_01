const errorHandler = (err, req, res, next) => {
  // Always log the error for debugging
  console.error('Error occurred:', err);

  // Handle Zod Validation Errors
  if (err.name === 'ZodError' || (err.issues && Array.isArray(err.issues))) {
    const formattedErrors = err.errors || err.issues;
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle SQLite Unique Constraint Errors (specifically duplicate emails)
  if (err.message && err.message.includes('UNIQUE constraint failed: users.email')) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists.'
    });
  }

  // Default Error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
