const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.cookies;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new UnauthorizedError('Пользователь не авторизован');

    next(err);
  }
  req.user = payload;
  next();
};
