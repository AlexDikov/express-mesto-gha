const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/user');

module.exports.getUsers = (res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next, err) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не авторизован');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      } else res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Введены неверные почта или пароль');
      } else {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.send({ token });
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .end();
      }
    })
    .catch(next);
};

module.exports.modifyUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка ввода');
      } else res.send({ data: user });
    })
    .catch(next);
};

module.exports.modifyUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка ввода');
      } else res.send({ data: user });
    })
    .catch(next);
};
