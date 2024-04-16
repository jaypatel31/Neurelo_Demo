const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error("No token provided");
    err.status = 400;
    next(err);
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decoded
    req.user = { id }
    next()
  } catch (error) {
    const err = new Error("Not authorized to access this route");
    err.status = 401;
    next(err);
  }
}
module.exports = {authenticationMiddleware}