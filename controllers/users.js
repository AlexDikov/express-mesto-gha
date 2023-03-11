const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(404).send({ message: "Ошибка ввода" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: "Ощибка ввода" }));
};

module.exports.modifyUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
    );
};

module.exports.modifyUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
    );
};
