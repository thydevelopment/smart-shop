
const notFound = (req, res, next) => {
  const error = new Error("The requested resource was not found.");
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
    error: error.message,
  })  
};

export { notFound };
