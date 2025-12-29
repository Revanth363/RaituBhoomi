const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message };
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return res.status(400).json({
      success: false,
      message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

module.exports = errorHandler;