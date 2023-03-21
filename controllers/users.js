const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  SERVER_ERROR, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, CONFLICT,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => { if (err) { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); } });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введен неверный id' });
      } else { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода' });
      }
      if (err.code === 11000) {
        res.status(CONFLICT).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user._id);
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        res.status(UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
      }
    });
};

module.exports.modifyUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода' });
      } else { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); }
    });
};

module.exports.modifyUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода' });
      } else { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); }
    });
};
