
const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode >= 400
      ? res.statusCode
      : 500;

  console.error("Error:", err.message);

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error. Please try again later."
        : err.message,
  });
};

export { errorHandler };
