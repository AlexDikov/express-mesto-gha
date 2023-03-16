const { SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require('../utils/constants');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => { if (err) { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); } });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user.userId)
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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка ввода' });
      } else { res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }); }
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
