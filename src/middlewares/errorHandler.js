module.exports = (err, req, res, next) => {
  //   console.error("ERROR 💥", err); // Log actual error on server

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};
