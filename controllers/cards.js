const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
    );
};

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.userId } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(404).send({ message: "Запрашиваемая карточка не найдена" })
    );
