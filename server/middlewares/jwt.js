const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (
    req.path === '/users/login' ||
    req.path === '/catalog/get-one-product' ||
    req.path === '/catalog/get-five-products' ||
    req.path === '/catalog/get-all-products'
  ) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error('[verifyToken] err :', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  verifyToken,
};
