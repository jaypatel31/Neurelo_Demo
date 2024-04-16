const globalErrorHandler = (err, req, res, next) => {
    let status = err.status
    err.status = err.status || 500
    res.status(err.status).json({
      message: status?err.message:"Something Went Wrong!!!",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
  }

module.exports = globalErrorHandler

// export default globalErrorHandler