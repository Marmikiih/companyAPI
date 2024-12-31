const jwt = require("jsonwebtoken");

const AuthenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication token is required.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    return res.status(401).json({
      status: false,
      message: "Authentication failed, Invalid or expired authentication token.",
    });
  }
};

module.exports = AuthenticateUser;
